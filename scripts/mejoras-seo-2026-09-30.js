// Mejoras SEO puntuales (30 sept 2026, auditoría M&P). Se ejecuta una vez vía workflow_dispatch.
// 1) Snippet: sitemap Rank Math sin caché (faltaban 32 posts de septiembre)
// 2) Títulos con "2023" → "2026" (título del post y rank_math_title)
// 3) noindex en /solicitar-demo-2/ (duplica /solicitar-demo/)
var WP = 'https://www.invaswms.com'
var AUTH = 'Basic ' + Buffer.from(process.env.INVAS_WP_USER + ':' + process.env.INVAS_WP_APP_PASSWORD).toString('base64')
var H = { Authorization: AUTH, 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (M&P SEO)' }
async function api(path, body, method) {
  var r = await fetch(WP + '/wp-json/' + path, { method: method || (body ? 'POST' : 'GET'), headers: H, body: body ? JSON.stringify(body) : undefined })
  var t = await r.text(); try { return { s: r.status, j: JSON.parse(t) } } catch (e) { return { s: r.status, j: t.slice(0, 200) } }
}
;(async function () {
  // 1) snippet
  var sn = await api('code-snippets/v1/snippets')
  var ya = Array.isArray(sn.j) && sn.j.some(function (x) { return /enable_caching/.test(x.code || '') })
  if (!ya) {
    var r = await api('code-snippets/v1/snippets', { name: 'Sitemap Rank Math sin caché (MyP 30 sept)', desc: 'La caché del sitemap no se invalidaba: posts nuevos quedaban fuera. Reversible desactivando.', code: "add_filter( 'rank_math/sitemap/enable_caching', '__return_false' );", scope: 'global', active: true })
    console.log('snippet', r.s, r.j && r.j.id, r.j && r.j.active)
  } else console.log('snippet ya existía')
  // 2) títulos 2023
  var posts = []
  for (var p = 1; p <= 3; p++) { var r2 = await api('wp/v2/posts?per_page=100&page=' + p + '&search=2023&context=edit&_fields=id,title,meta'); if (!Array.isArray(r2.j) || !r2.j.length) break; posts = posts.concat(r2.j); if (r2.j.length < 100) break }
  for (var i = 0; i < posts.length; i++) {
    var t = posts[i].title.raw
    if (!/\b2023\b/.test(t)) continue
    var nuevo = t.replace(/\b2023\b/g, '2026')
    var u = await api('wp/v2/posts/' + posts[i].id, { title: nuevo })
    var m = await api('rankmath/v1/updateMeta', { objectType: 'post', objectID: posts[i].id, meta: { rank_math_title: nuevo + ' | invasWMS Blog' } })
    console.log('titulo', posts[i].id, u.s, m.s, t, '→', nuevo)
  }
  // 3) noindex solicitar-demo-2
  var pg = await api('wp/v2/pages?slug=solicitar-demo-2&_fields=id')
  if (Array.isArray(pg.j) && pg.j[0]) { var n = await api('rankmath/v1/updateMeta', { objectType: 'post', objectID: pg.j[0].id, meta: { rank_math_robots: ['noindex', 'follow'] } }); console.log('noindex solicitar-demo-2', pg.j[0].id, n.s) }
  // verificación sitemap
  var sm = await (await fetch(WP + '/post-sitemap.xml?nc=' + Date.now(), { headers: { 'User-Agent': 'Mozilla/5.0' } })).text()
  console.log('posts en sitemap:', (sm.match(/<loc>/g) || []).length)
})()
