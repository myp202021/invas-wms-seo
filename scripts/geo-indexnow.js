// IndexNow (30 sept 2026): envía todas las URLs del sitemap vía Rank Math Instant Indexing (usa la clave válida del propio sitio)
// y muestra el registro de envíos automáticos de Rank Math para confirmar que cada artículo nuevo se avisa a Bing.
var WP = 'https://www.invaswms.com'
var AUTH = 'Basic ' + Buffer.from(process.env.INVAS_WP_USER + ':' + process.env.INVAS_WP_APP_PASSWORD).toString('base64')
var UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36'
async function txt(u) { return (await fetch(u, { headers: { 'User-Agent': UA } })).text() }
;(async function () {
  var idx = await txt(WP + '/sitemap_index.xml'), urls = []
  var maps = (idx.match(/<loc>([^<]+)<\/loc>/g) || []).map(function (l) { return l.replace(/<\/?loc>/g, '') })
  for (var m of maps) urls = urls.concat(((await txt(m)).match(/<loc>([^<]+)<\/loc>/g) || []).map(function (l) { return l.replace(/<\/?loc>/g, '') }).filter(function (u) { return !/\.(jpg|png|webp)$/.test(u) }))
  urls = Array.from(new Set(urls)); console.log('URLs', urls.length)
  for (var i = 0; i < urls.length; i += 100) {
    var r = await fetch(WP + '/wp-json/rankmath/v1/in/submitUrls', { method: 'POST', headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'User-Agent': UA }, body: JSON.stringify({ urls: urls.slice(i, i + 100).join('\n') }) })
    console.log('lote', i, r.status, (await r.text()).slice(0, 120))
  }
  var log = await fetch(WP + '/wp-json/rankmath/v1/in/getLog', { method: 'POST', headers: { Authorization: AUTH, 'User-Agent': UA } })
  var j = await log.json().catch(function () { return {} })
  var auto = (j.data || []).filter(function (x) { return !x.manual_submission })
  console.log('envíos automáticos registrados:', auto.length, auto.slice(0, 3).map(function (x) { return x.timeFormatted + ' ' + x.status + ' ' + x.url }).join(' | '))
})()
