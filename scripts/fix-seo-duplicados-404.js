// fix-seo-duplicados-404.js
// Arregla duplicados y 404s detectados en GSC junio 2026
// 1. Pone en draft los posts duplicados (los saca del sitemap)
// 2. Muestra las redirecciones 301 que hay que agregar al Snippet #15
//
// Uso: node scripts/fix-seo-duplicados-404.js

var fetch = globalThis.fetch || require('node-fetch')

var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

// ═══════════════════════════════════════════
// SLUGS DUPLICADOS → poner en DRAFT
// ═══════════════════════════════════════════
var DUPLICADOS = [
  { slug: 'mejores-wms-chile-2026-2', original: '/mejores-wms-chile-2026/' },
  { slug: 'mejores-wms-chile-2026-3', original: '/mejores-wms-chile-2026/' },
  { slug: 'peak-season-almacen-2', original: '/peak-season-almacen/' },
  { slug: 'mejores-wms-latinoamerica-2026-2', original: '/mejores-wms-latinoamerica-2026/' },
  { slug: 'redujimos-el-tiempo-de-preparacion-de-pedidos-en-un-60-2', original: '/redujimos-el-tiempo-de-preparacion-de-pedidos-en-un-60/' },
  { slug: 'caso-exito-picking-2', original: '/caso-exito-picking/' },
]

async function findAndDraftDuplicates() {
  console.log('\n═══ PASO 1: Buscar y poner en draft posts duplicados ═══\n')

  for (var dup of DUPLICADOS) {
    try {
      // Buscar por slug en posts
      var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?slug=' + dup.slug + '&status=publish', {
        headers: { 'Authorization': AUTH }
      })
      var posts = await res.json()

      if (!posts.length) {
        // Buscar en pages
        res = await fetch(WP_URL + '/wp-json/wp/v2/pages?slug=' + dup.slug + '&status=publish', {
          headers: { 'Authorization': AUTH }
        })
        posts = await res.json()
      }

      if (posts.length) {
        var post = posts[0]
        console.log('ENCONTRADO: ' + dup.slug + ' (ID: ' + post.id + ', tipo: ' + post.type + ')')

        // Poner en draft
        var endpoint = post.type === 'page' ? 'pages' : 'posts'
        var updateRes = await fetch(WP_URL + '/wp-json/wp/v2/' + endpoint + '/' + post.id, {
          method: 'POST',
          headers: {
            'Authorization': AUTH,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'draft' })
        })
        var updated = await updateRes.json()

        if (updated.status === 'draft') {
          console.log('  ✅ Puesto en DRAFT → redirigir a ' + dup.original)
        } else {
          console.log('  ❌ Error al poner en draft: ' + JSON.stringify(updated.message || updated.status))
        }
      } else {
        console.log('NO ENCONTRADO como publicado: ' + dup.slug + ' (puede que ya esté en draft)')
      }
    } catch (err) {
      console.log('ERROR buscando ' + dup.slug + ': ' + err.message)
    }
  }
}

async function checkRedirectTargets() {
  console.log('\n═══ PASO 2: Verificar que las páginas destino existen ═══\n')

  var redirects = [
    // Duplicados
    { from: '/mejores-wms-chile-2026-2/', to: '/mejores-wms-chile-2026/' },
    { from: '/mejores-wms-chile-2026-3/', to: '/mejores-wms-chile-2026/' },
    { from: '/peak-season-almacen-2/', to: '/peak-season-almacen/' },
    { from: '/mejores-wms-latinoamerica-2026-2/', to: '/mejores-wms-latinoamerica-2026/' },
    { from: '/redujimos-el-tiempo-de-preparacion-de-pedidos-en-un-60-2/', to: '/redujimos-el-tiempo-de-preparacion-de-pedidos-en-un-60/' },
    { from: '/caso-exito-picking-2/', to: '/caso-exito-picking/' },
    // 404s industrias (reestructuradas)
    { from: '/industrias/', to: '/software-logistico-por-industria/' },
    { from: '/industrias/tecnologia/', to: '/software-logistico-por-industria/software-logistico-para-tecnologia/' },
    { from: '/industrias/operadores-logisticos-3pl-4pl/', to: '/software-logistico-por-industria/software-logistico-para-3pl-y-4pl/' },
    { from: '/industrias/retail-ecommerce-omnicanal/', to: '/software-logistico-por-industria/software-logistico-retail-omnicanal/' },
    { from: '/industrias/alimentos/', to: '/software-logistico-por-industria/software-logistico-para-alimentos/' },
    { from: '/industrias/ecommerce-fulfillment/', to: '/software-logistico-por-industria/software-logistico-retail-omnicanal/' },
    { from: '/industrias/3pl/', to: '/software-logistico-por-industria/software-logistico-para-3pl-y-4pl/' },
    // 404s otras páginas
    { from: '/blog/wms-vs-erp/', to: '/blog/' },
    { from: '/solicitar-una-demo', to: '/demo-wms/' },
    { from: '/invasanalytics/', to: '/plataforma-de-datos-logisticos/' },
    { from: '/blog/que-es-un-wms/', to: '/que-es-un-wms-y-por-que-tu-empresa-lo-necesita-en-2026/' },
    // Notas: /wms/ y /nosotros/ y /soporte/ ya tienen redirects (aparecen en lista de "Página con redirección")
  ]

  for (var r of redirects) {
    try {
      var res = await fetch(WP_URL + r.to, { method: 'HEAD', redirect: 'manual' })
      var status = res.status
      var ok = status >= 200 && status < 400
      console.log((ok ? '✅' : '❌') + ' ' + r.from + ' → ' + r.to + ' (destino: ' + status + ')')
    } catch (err) {
      console.log('❌ ' + r.from + ' → ' + r.to + ' (error: ' + err.message + ')')
    }
  }

  console.log('\n═══ PASO 3: PHP para Snippet #15 (copiar en Code Snippets) ═══\n')
  console.log(generatePHP(redirects))
}

function generatePHP(redirects) {
  var php = "// ═══ Redirects 301 — SEO Fix Junio 2026 (M&P) ═══\n"
  php += "// Agregar al final del Snippet #15 existente\n"
  php += "add_action('template_redirect', function() {\n"
  php += "  $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);\n"
  php += "  $path = rtrim($path, '/') . '/';\n"
  php += "  $redirects = array(\n"

  for (var r of redirects) {
    var fromNorm = r.from.replace(/\/$/, '') + '/'
    php += "    '" + fromNorm + "' => '" + r.to + "',\n"
  }

  php += "  );\n"
  php += "  if (isset($redirects[$path])) {\n"
  php += "    wp_redirect(home_url($redirects[$path]), 301);\n"
  php += "    exit;\n"
  php += "  }\n"
  php += "}, 1);\n"

  return php
}

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  FIX SEO — invasWMS — Duplicados + 404s')
  console.log('  Fecha: ' + new Date().toISOString().slice(0, 10))
  console.log('═══════════════════════════════════════════════════')

  await findAndDraftDuplicates()
  await checkRedirectTargets()

  console.log('\n═══ RESUMEN ═══')
  console.log('1. Posts duplicados → puestos en DRAFT (salen del sitemap)')
  console.log('2. Redirecciones 301 → copiar PHP en Snippet #15 de Code Snippets')
  console.log('3. Páginas noindex → /author/ad-invas-min/ y litespeed guest.vary.php → OK, no son comerciales')
  console.log('4. hreflang → requiere configurar Polylang Pro en wp-admin (conexiones ES↔EN)')
  console.log('5. URLs ?nocache= → son de WP Super Cache, se resuelven solas con canonical')
}

main().catch(function(err) { console.error('Error fatal:', err) })
