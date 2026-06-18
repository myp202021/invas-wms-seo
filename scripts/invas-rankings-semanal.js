// invas-rankings-semanal.js
// Genera 1 artículo de ranking/comparativa semanal para invaswms.com
// Publica via WordPress REST API
// Corre via GitHub Actions cada jueves 08:00 AM Chile
//
// Uso: node scripts/invas-rankings-semanal.js
// Requiere: OPENAI_API_KEY, INVAS_WP_USER, INVAS_WP_APP_PASSWORD, INVAS_WP_URL

var fetch = require('node-fetch')

var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var OPENAI_KEY = process.env.OPENAI_API_KEY
var RESEND_KEY = process.env.RESEND
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

if (!OPENAI_KEY) { console.error('OPENAI_API_KEY requerida'); process.exit(1) }

// ═══════════════════════════════════════════
// RANKINGS Y COMPARATIVAS (rotación semanal)
// ═══════════════════════════════════════════
var RANKINGS = [
  { titulo: 'Los 10 mejores WMS para Chile en 2026', keywords: 'mejores WMS Chile, top WMS Chile 2026, ranking software WMS', tipo: 'ranking' },
  { titulo: 'Top 8 WMS para operadores logísticos 3PL en LATAM', keywords: 'WMS 3PL LATAM, mejores WMS operador logístico, ranking 3PL', tipo: 'ranking' },
  { titulo: 'Ranking: mejores WMS para la industria de alimentos 2026', keywords: 'WMS alimentos ranking, mejor WMS cadena frío, WMS food Chile', tipo: 'ranking' },
  { titulo: 'Comparativa WMS cloud: invasWMS vs SAP EWM vs Oracle WMS', keywords: 'comparativa WMS, invasWMS vs SAP, WMS cloud comparativa', tipo: 'comparativo' },
  { titulo: 'Top 5 WMS para pymes en Chile y Latinoamérica', keywords: 'WMS pymes Chile, WMS pequeña empresa, WMS económico LATAM', tipo: 'ranking' },
  { titulo: 'Ranking WMS para retail omnicanal en Latinoamérica', keywords: 'WMS retail LATAM, WMS omnicanal ranking, fulfillment WMS', tipo: 'ranking' },
  { titulo: 'WMS para e-commerce fulfillment: los mejores de 2026', keywords: 'WMS ecommerce, WMS fulfillment, mejores WMS ecommerce 2026', tipo: 'ranking' },
  { titulo: 'Mejores WMS para cadena de frío en Latinoamérica 2026', keywords: 'WMS cadena frío LATAM, WMS refrigerado, cold chain WMS', tipo: 'ranking' },
  { titulo: 'Comparativa: WMS nacionales vs WMS internacionales en Chile', keywords: 'WMS chileno vs internacional, WMS local Chile, comparativa WMS', tipo: 'comparativo' },
  { titulo: 'Top WMS para distribución farmacéutica en Chile', keywords: 'WMS farmacéutica Chile, WMS medicamentos, trazabilidad farmacia', tipo: 'ranking' },
  { titulo: 'Ranking de WMS por costo-beneficio para LATAM 2026', keywords: 'WMS costo beneficio, WMS precio calidad, WMS económico bueno', tipo: 'ranking' },
  { titulo: 'Los mejores WMS con integración a ERP SAP en Chile', keywords: 'WMS integración SAP, WMS compatible SAP Chile, WMS SAP conector', tipo: 'ranking' },
  { titulo: 'Top WMS para la minería en Chile: gestión de bodegas en faena', keywords: 'WMS minería Chile, WMS faena minera, almacén minero ranking', tipo: 'ranking' },
  { titulo: 'Comparativa WMS: funcionalidades esenciales vs premium', keywords: 'funcionalidades WMS, comparar WMS features, WMS básico vs avanzado', tipo: 'comparativo' },
]

async function obtenerPostsExistentes() {
  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?per_page=100&_fields=title,slug&categories_exclude=', {
    headers: { 'Authorization': AUTH }
  })
  var posts = await res.json()
  return posts.map(function(p) { return p.title.rendered.toLowerCase() })
}

function seleccionarRanking(existentes) {
  var disponibles = RANKINGS.filter(function(r) {
    return !existentes.some(function(e) {
      return e.includes(r.titulo.substring(0, 25).toLowerCase())
    })
  })
  if (disponibles.length === 0) disponibles = RANKINGS
  return disponibles[Math.floor(Math.random() * disponibles.length)]
}

async function generarRanking(ranking) {
  var prompt = `Eres el analista de mercado de invasWMS, un software WMS 100% cloud para Latinoamérica. Genera un artículo de RANKING/COMPARATIVA profesional y completo.

DATOS DE invasWMS:
- +700 sitios conectados en América
- +250.000 líneas despachadas diariamente
- +1.800 usuarios conectados
- Presencia en Chile, Colombia, México, Perú y USA
- Caso: +400% capacidad despacho en 30 días
- Caso: -60% tiempo de preparación pedidos
- Caso: -25% errores de picking
- Implementación en menos de 30 días
- 100% cloud, escalable
- Precio: desde USD $500/mes

ARTÍCULO: ${ranking.titulo}
KEYWORDS: ${ranking.keywords}
TIPO: ${ranking.tipo}

INSTRUCCIONES:
1. Mínimo 2000 palabras, muy detallado.
2. Si es ranking: lista al menos 6-8 opciones reales del mercado con pros/contras de cada uno.
3. invasWMS debe aparecer en el ranking de forma honesta (no forzadamente #1), destacando sus fortalezas reales: implementación rápida, cloud nativo, soporte LATAM, precio competitivo.
4. Incluir competidores reales: SAP EWM, Oracle WMS, Manhattan Associates, Mecalux Easy WMS, Blue Yonder, Altanet, Defontana, Bsale (cuando aplique).
5. Estructura: Introducción → Criterios de evaluación → Ranking con detalle → Tabla comparativa resumen → Conclusión con CTA.
6. Incluye una tabla comparativa HTML con columnas: Solución, Tipo (cloud/on-prem), Precio aprox, Ideal para, Nota.
7. Links internos:
   - <a href="/sistema-de-gestion-de-almacenes-wms/">invasWMS</a>
   - <a href="/contacto-invas/">solicitar una demo</a>
8. Escribe como analista imparcial que conoce el mercado LATAM.
9. NO uses clichés vacíos.

FORMATO DE RESPUESTA (JSON):
{
  "titulo_seo": "Título optimizado para Google (max 60 chars)",
  "meta_description": "Meta description (max 155 chars)",
  "slug": "url-amigable",
  "extracto": "Resumen de 2 líneas",
  "contenido_html": "<h2>...</h2><p>...</p>...",
  "tags": ["tag1", "tag2", "tag3"]
}

Responde SOLO con el JSON.`

  var res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 6000,
    })
  })

  var data = await res.json()
  var content = data.choices[0].message.content.trim()
  content = content.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(content)
}

async function obtenerOCrearCategoria(nombre) {
  var res = await fetch(WP_URL + '/wp-json/wp/v2/categories?search=' + encodeURIComponent(nombre), {
    headers: { 'Authorization': AUTH }
  })
  var cats = await res.json()
  if (cats.length > 0) return cats[0].id

  var res2 = await fetch(WP_URL + '/wp-json/wp/v2/categories', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nombre })
  })
  var cat = await res2.json()
  return cat.id
}

async function publicarEnWordPress(articulo) {
  var catId = await obtenerOCrearCategoria('Rankings')

  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: articulo.titulo_seo,
      slug: articulo.slug,
      content: articulo.contenido_html,
      excerpt: articulo.extracto,
      status: 'publish',
      categories: [catId],
      meta: {
        rank_math_title: articulo.titulo_seo + ' | invasWMS Blog',
        rank_math_description: articulo.meta_description,
        rank_math_focus_keyword: articulo.tags ? articulo.tags[0] : '',
      }
    })
  })

  return await res.json()
}

async function notificarEmail(articulo, postUrl) {
  if (!RESEND_KEY) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'M&P SEO <contacto@mulleryperez.cl>',
        to: ['contacto@mulleryperez.cl', 'jvio@impruvex.com', 'cvilo@impruvex.com'],
        subject: '📊 Ranking invasWMS: ' + articulo.titulo_seo,
        html: '<div style="font-family:sans-serif;max-width:500px">'
          + '<h2 style="color:#1a1a2e">Nuevo ranking publicado en invasWMS</h2>'
          + '<p><strong>' + articulo.titulo_seo + '</strong></p>'
          + '<p>' + articulo.meta_description + '</p>'
          + '<p><a href="' + postUrl + '" style="color:#2563EB">Ver ranking →</a></p>'
          + '</div>'
      })
    })
  } catch (e) { console.log('Email notification failed (non-critical)') }
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  INVAS WMS — RANKING SEMANAL')
  console.log('  ' + new Date().toISOString().split('T')[0])
  console.log('═══════════════════════════════════════════\n')

  var existentes = await obtenerPostsExistentes()
  console.log('Posts existentes: ' + existentes.length)

  var ranking = seleccionarRanking(existentes)
  console.log('Ranking seleccionado: ' + ranking.titulo)
  console.log('Keywords: ' + ranking.keywords)

  console.log('\nGenerando ranking con GPT-4o...')
  var articulo = await generarRanking(ranking)
  console.log('Artículo generado: ' + articulo.titulo_seo)
  console.log('Largo HTML: ' + (articulo.contenido_html || '').length + ' chars')

  console.log('\nPublicando en WordPress...')
  var post = await publicarEnWordPress(articulo)

  if (post.id) {
    var postUrl = post.link || (WP_URL + '/' + articulo.slug + '/')
    console.log('\n✅ PUBLICADO')
    console.log('   ID: ' + post.id)
    console.log('   URL: ' + postUrl)
    console.log('   Título: ' + articulo.titulo_seo)

    await notificarEmail(articulo, postUrl)
    console.log('   Email: enviado a contacto@mulleryperez.cl + jvio + cvilo@impruvex.com')
  } else {
    console.error('❌ Error publicando:', JSON.stringify(post).substring(0, 200))
    process.exit(1)
  }
}

main().catch(function(e) {
  console.error('Error fatal:', e.message)
  process.exit(1)
})
