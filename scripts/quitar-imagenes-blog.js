// quitar-imagenes-blog.js
// Remueve la imagen destacada de TODOS los posts EXCEPTO los de categoría "Casos de Éxito" (ID 53)
// Las imágenes DALL-E no son atingentes al contenido — mejor dejar solo texto.
//
// Uso: node scripts/quitar-imagenes-blog.js
// Requiere: INVAS_WP_USER, INVAS_WP_APP_PASSWORD

var fetch = globalThis.fetch || require('node-fetch')

var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

// Categoría de casos de éxito — NO tocar sus imágenes
var CASO_EXITO_CAT = 53

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  QUITAR IMÁGENES DESTACADAS — BLOG INVAS')
  console.log('  (excepto Casos de Éxito, cat ' + CASO_EXITO_CAT + ')')
  console.log('═══════════════════════════════════════════\n')

  // Obtener todos los posts publicados (paginado)
  var allPosts = []
  var pg = 1
  while (true) {
    var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?per_page=100&status=publish&_fields=id,title,featured_media,categories&page=' + pg, {
      headers: { 'Authorization': AUTH }
    })
    if (!res.ok) break
    var posts = await res.json()
    if (!Array.isArray(posts) || !posts.length) break
    allPosts = allPosts.concat(posts)
    pg++
  }

  console.log('Total posts publicados: ' + allPosts.length)

  // Filtrar: solo posts con imagen Y que NO sean caso de éxito
  var conImagen = allPosts.filter(function(p) {
    return p.featured_media && p.featured_media > 0 && p.categories.indexOf(CASO_EXITO_CAT) === -1
  })

  var casosExito = allPosts.filter(function(p) {
    return p.categories.indexOf(CASO_EXITO_CAT) !== -1
  })

  console.log('Posts con imagen (no caso de éxito): ' + conImagen.length)
  console.log('Casos de éxito (imagen intacta): ' + casosExito.length + '\n')

  if (!conImagen.length) {
    console.log('No hay imágenes que remover. Todo limpio.')
    return
  }

  // Remover imagen destacada (featured_media = 0)
  var ok = 0
  var fail = 0
  for (var p of conImagen) {
    try {
      var res2 = await fetch(WP_URL + '/wp-json/wp/v2/posts/' + p.id, {
        method: 'POST',
        headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured_media: 0 })
      })
      var updated = await res2.json()
      if (updated.id && updated.featured_media === 0) {
        console.log('  ✅ ' + p.id + ' — ' + (p.title.rendered || '').substring(0, 60))
        ok++
      } else {
        console.log('  ❌ ' + p.id + ' — respuesta inesperada')
        fail++
      }
    } catch (e) {
      console.log('  ❌ ' + p.id + ' — ' + e.message)
      fail++
    }
  }

  console.log('\n═══ RESULTADO ═══')
  console.log('Imágenes removidas: ' + ok)
  console.log('Errores: ' + fail)
  console.log('Casos de éxito intactos: ' + casosExito.length)
}

main().catch(function(e) { console.error('Error:', e.message); process.exit(1) })
