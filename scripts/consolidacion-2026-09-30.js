// Consolidación de artículos repetidos en invaswms.com (aprobada por Christopher 30 sept 2026).
// 1) Snippet con redirecciones 301 (Code Snippets; Rank Math no expone redirecciones por REST)
// 2) Los artículos redirigidos pasan a borrador (salen del sitemap)
// 3) Verificación: cada URL antigua responde 301 a la conservada
var fs = require('fs')
var WP = 'https://www.invaswms.com'
var AUTH = 'Basic ' + Buffer.from(process.env.INVAS_WP_USER + ':' + process.env.INVAS_WP_APP_PASSWORD).toString('base64')
var H = { Authorization: AUTH, 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (M&P SEO)' }
async function api(path, body) {
  var r = await fetch(WP + '/wp-json/' + path, { method: body ? 'POST' : 'GET', headers: H, body: body ? JSON.stringify(body) : undefined })
  var t = await r.text(); try { return { s: r.status, j: JSON.parse(t) } } catch (e) { return { s: r.status, j: t.slice(0, 200) } }
}
var MAPA = JSON.parse(fs.readFileSync('data-consolidacion-2026-09-30.json', 'utf8'))
;(async function () {
  var php = "add_action( 'template_redirect', function () {\n  $mapa = array(\n" +
    Object.keys(MAPA).map(function (k) { return "    '" + k + "' => '" + MAPA[k] + "'," }).join('\n') +
    "\n  );\n  $ruta = trailingslashit( wp_parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ) );\n  if ( isset( $mapa[ $ruta ] ) ) { wp_safe_redirect( home_url( $mapa[ $ruta ] ), 301 ); exit; }\n}, 1 );"
  var sn = await api('code-snippets/v1/snippets')
  var ya = Array.isArray(sn.j) && sn.j.find(function (x) { return /Consolidación M&P/.test(x.name || '') })
  var r = ya ? await api('code-snippets/v1/snippets/' + ya.id, { code: php, active: true })
             : await api('code-snippets/v1/snippets', { name: 'Consolidación M&P 30 sept (redirecciones 301)', desc: 'Artículos repetidos redirigidos a la versión conservada. Reversible desactivando.', code: php, scope: 'front-end', active: true })
  console.log('snippet', r.s, r.j && r.j.id, r.j && r.j.active)
  if (!(r.j && r.j.active)) { console.log('snippet no activo, se detiene', JSON.stringify(r.j).slice(0, 300)); process.exit(1) }
  // prueba con la primera URL antes de pasar a borrador
  var k0 = Object.keys(MAPA)[0]
  var t0 = await fetch(WP + k0 + '?nc=' + Date.now(), { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0' } })
  console.log('prueba', k0, t0.status, t0.headers.get('location'))
  if (t0.status !== 301) { console.log('la redirección no responde 301, se detiene'); process.exit(1) }
  var borr = 0, ok = 0, mal = []
  for (var src in MAPA) {
    var slug = src.replace(/^\/|\/$/g, '').split('/').pop()
    var p = await api('wp/v2/posts?slug=' + encodeURIComponent(slug) + '&_fields=id,status')
    if (Array.isArray(p.j) && p.j[0]) { var u = await api('wp/v2/posts/' + p.j[0].id, { status: 'draft' }); if (u.s === 200) borr++ }
    var t = await fetch(WP + src + '?nc=' + Date.now(), { redirect: 'manual', headers: { 'User-Agent': 'Mozilla/5.0' } })
    var loc = t.headers.get('location') || ''
    if (t.status === 301 && loc.replace(/\?.*$/, '').endsWith(MAPA[src])) ok++; else mal.push(src + ' ' + t.status + ' ' + loc)
  }
  console.log('redirecciones', Object.keys(MAPA).length, '| ok', ok, '| posts a borrador', borr)
  if (mal.length) console.log('con problema:\n' + mal.join('\n'))
})()
