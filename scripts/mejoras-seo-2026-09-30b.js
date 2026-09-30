// Mejoras SEO Invas (30 sept 2026, 2ª tanda): títulos largos en Google + schema FAQPage en posts con preguntas frecuentes visibles.
var WP = 'https://www.invaswms.com'
var AUTH = 'Basic ' + Buffer.from(process.env.INVAS_WP_USER + ':' + process.env.INVAS_WP_APP_PASSWORD).toString('base64')
var H = { Authorization: AUTH, 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0 (M&P SEO)' }
async function api(path, body) {
  var r = await fetch(WP + '/wp-json/' + path, { method: body ? 'POST' : 'GET', headers: H, body: body ? JSON.stringify(body) : undefined })
  var t = await r.text(); try { return { s: r.status, j: JSON.parse(t) } } catch (e) { return { s: r.status, j: t.slice(0, 200) } }
}
function dec(s) { return String(s).replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&amp;/g, '&').replace(/&quot;/g, '"') }
function limpio(h) { return h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() }
function faqs(html) {
  var i = html.search(/<h[23][^>]*>[^<]*(preguntas frecuentes|faq)/i); if (i === -1) return []
  var zona = html.slice(i), out = [], re = /<h[34][^>]*>([\s\S]*?)<\/h[34]>([\s\S]*?)(?=<h[1-4]\b|$)/gi, m
  while ((m = re.exec(zona))) { var q = limpio(m[1]), a = limpio(m[2]); if (/\?/.test(q) && a.length > 30) out.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.slice(0, 900) } }) }
  return out
}
;(async function () {
  var posts = []
  for (var p = 1; p <= 5; p++) { var r = await api('wp/v2/posts?per_page=100&page=' + p + '&context=edit&_fields=id,slug,title,content'); if (!Array.isArray(r.j) || !r.j.length) break; posts = posts.concat(r.j); if (r.j.length < 100) break }
  console.log('posts', posts.length)
  var tit = 0, faq = 0, sinFaq = 0
  for (var i = 0; i < posts.length; i++) {
    var x = posts[i], t = dec(x.title.raw).trim()
    // Title en Google ≤ 60: "Título | invasWMS" si cabe; si no, solo el título (la marca ya va en el schema)
    var nuevo = (t + ' | invasWMS Blog').length <= 60 ? null : (t + ' | invasWMS').length <= 60 ? t + ' | invasWMS' : t
    if (nuevo) { var m = await api('rankmath/v1/updateMeta', { objectType: 'post', objectID: x.id, meta: { rank_math_title: nuevo } }); if (m.s === 200) tit++; else console.log('error title', x.slug, m.s) }
    var raw = x.content.raw
    if (!/FAQPage/.test(raw)) {
      var f = faqs(raw)
      if (f.length >= 2) {
        var u = await api('wp/v2/posts/' + x.id, { content: raw + '\n<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: f }) + '</script>' })
        if (u.s === 200) faq++; else console.log('error faq', x.slug, u.s)
      } else if (/preguntas frecuentes/i.test(raw)) sinFaq++
    }
  }
  console.log('títulos ajustados', tit, '| FAQ schema agregado', faq, '| con FAQ pero sin preguntas detectables', sinFaq)
})()
