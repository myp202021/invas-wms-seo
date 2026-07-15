// fix-blog-posts.js
// 1. Poner en draft los casos de éxito genéricos (sin empresa real)
// 2. Agregar imagen destacada a TODOS los posts que no la tengan
// 3. Quitar video del post de Dräger (ID 3185)
//
// Uso: INVAS_WP_USER=xx INVAS_WP_APP_PASSWORD=xx node scripts/fix-blog-posts.js

var fetch = globalThis.fetch || require('node-fetch')

var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var OPENAI_KEY = process.env.OPENAI_API_KEY
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

// IDs de casos genéricos a poner en draft
var DRAFT_IDS = [5863, 5798]

// Post Dräger — quitar video, mantener contenido
var DRAGER_ID = 3185

// ═══════════════════════════════
// PASO 1: Draft los genéricos
// ═══════════════════════════════
async function draftGenericos() {
  console.log('\n═══ PASO 1: Draft casos genéricos ═══')
  for (var id of DRAFT_IDS) {
    var res = await fetch(WP_URL + '/wp-json/wp/v2/posts/' + id, {
      method: 'POST',
      headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'draft' })
    })
    var post = await res.json()
    console.log('  Post ' + id + ': ' + (post.status === 'draft' ? '✅ draft' : '❌ error') + ' — ' + (post.title?.rendered || ''))
  }
}

// ═══════════════════════════════
// PASO 2: Generar y subir imagen
// ═══════════════════════════════
async function generarImagen(titulo) {
  if (!OPENAI_KEY) {
    console.log('  ⚠️ Sin OPENAI_API_KEY — no se puede generar imagen')
    return null
  }

  var prompt = 'Professional photograph of a modern warehouse or logistics center related to: ' + titulo.substring(0, 100) + '. Clean, well-lit industrial space with organized shelving, automated systems, or workers with tablets. Corporate style, no text overlay, no logos.'

  try {
    var res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
      })
    })
    var data = await res.json()
    if (data.data && data.data[0]) {
      return data.data[0].url
    }
  } catch (e) {
    console.log('  ❌ Error generando imagen: ' + e.message)
  }
  return null
}

async function subirImagenAWordPress(imageUrl, titulo) {
  // Descargar la imagen
  var imgRes = await fetch(imageUrl)
  var imgBuffer = Buffer.from(await imgRes.arrayBuffer())

  var slug = titulo.substring(0, 50).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  var filename = 'blog-' + slug + '.png'

  var res = await fetch(WP_URL + '/wp-json/wp/v2/media', {
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Disposition': 'attachment; filename="' + filename + '"',
      'Content-Type': 'image/png',
    },
    body: imgBuffer,
  })

  var media = await res.json()
  if (media.id) {
    return media.id
  }
  console.log('  ❌ Error subiendo imagen:', media.message || media)
  return null
}

async function asignarImagenDestacada(postId, mediaId) {
  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts/' + postId, {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ featured_media: mediaId })
  })
  var post = await res.json()
  return post.featured_media === mediaId
}

// ═══════════════════════════════
// PASO 2: Agregar imágenes a posts sin imagen
// ═══════════════════════════════
async function agregarImagenesFaltantes() {
  console.log('\n═══ PASO 2: Agregar imágenes a posts sin imagen ═══')

  // Obtener TODOS los posts publicados (paginado)
  var allPosts = []
  var page = 1
  while (true) {
    var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?per_page=100&page=' + page + '&status=publish&_fields=id,title,featured_media,slug', {
      headers: { 'Authorization': AUTH }
    })
    var posts = await res.json()
    if (!Array.isArray(posts) || posts.length === 0) break
    allPosts = allPosts.concat(posts)
    page++
  }

  console.log('  Total posts publicados: ' + allPosts.length)

  // Filtrar los que no tienen imagen
  var sinImagen = allPosts.filter(function(p) { return !p.featured_media || p.featured_media === 0 })
  console.log('  Posts sin imagen: ' + sinImagen.length)

  for (var i = 0; i < sinImagen.length; i++) {
    var post = sinImagen[i]
    var titulo = post.title.rendered || post.title.raw || post.slug
    console.log('\n  [' + (i + 1) + '/' + sinImagen.length + '] Post ' + post.id + ': ' + titulo.substring(0, 60))

    // Generar imagen con DALL-E
    var imageUrl = await generarImagen(titulo)
    if (!imageUrl) continue

    // Subir a WordPress
    var mediaId = await subirImagenAWordPress(imageUrl, titulo)
    if (!mediaId) continue

    // Asignar como imagen destacada
    var ok = await asignarImagenDestacada(post.id, mediaId)
    console.log('  ' + (ok ? '✅' : '❌') + ' Imagen asignada (media ' + mediaId + ')')

    // Rate limit — esperar entre generaciones
    await new Promise(function(r) { setTimeout(r, 3000) })
  }
}

// ═══════════════════════════════
// PASO 3: Quitar video de Dräger
// ═══════════════════════════════
async function arreglarDrager() {
  console.log('\n═══ PASO 3: Limpiar video de Dräger (post ' + DRAGER_ID + ') ═══')

  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts/' + DRAGER_ID + '?_fields=id,title,content', {
    headers: { 'Authorization': AUTH }
  })
  var post = await res.json()
  if (!post.content) {
    console.log('  ❌ No se pudo obtener el post')
    return
  }

  var content = post.content.rendered || post.content.raw || ''
  var originalLen = content.length

  // Quitar iframes, videos, embeds de YouTube/Vimeo
  content = content.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
  content = content.replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '')
  content = content.replace(/\[embed\][\s\S]*?\[\/embed\]/gi, '')
  content = content.replace(/<figure[^>]*class="[^"]*wp-block-embed[^"]*"[^>]*>[\s\S]*?<\/figure>/gi, '')
  content = content.replace(/https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\/[^\s<"]+/gi, '')

  if (content.length === originalLen) {
    console.log('  No se encontró video/iframe en el contenido')
    return
  }

  var res2 = await fetch(WP_URL + '/wp-json/wp/v2/posts/' + DRAGER_ID, {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: content })
  })
  var updated = await res2.json()
  console.log('  ✅ Video removido. Contenido: ' + originalLen + ' → ' + content.length + ' chars')
}

// ═══════════════════════════════
// MAIN
// ═══════════════════════════════
async function main() {
  console.log('═══════════════════════════════════════')
  console.log('  FIX BLOG POSTS — invaswms.com')
  console.log('  ' + new Date().toISOString())
  console.log('═══════════════════════════════════════')

  await draftGenericos()
  await arreglarDrager()
  await agregarImagenesFaltantes()

  console.log('\n═══ DONE ═══')
}

main().catch(function(e) { console.error('FATAL:', e); process.exit(1) })
