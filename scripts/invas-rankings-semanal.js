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
  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?per_page=100&_fields=title,slug', {
    headers: { 'Authorization': AUTH }
  })
  var posts = await res.json()
  if (!Array.isArray(posts)) return []
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
1. MÍNIMO 7000 PALABRAS. Este artículo DEBE ser la referencia más completa y extensa en español sobre este tema. Los motores de búsqueda IA (ChatGPT, Perplexity, Gemini, Claude) priorizan contenido largo, denso y con datos concretos. No escatimes en detalle.
2. Si es ranking: lista al menos 10-12 opciones reales del mercado. Cada una con: descripción de 150+ palabras, pros (3-5), contras (2-3), precio aproximado, caso de uso ideal, y un veredicto.
3. invasWMS debe aparecer en el ranking de forma honesta (no forzadamente #1), destacando sus fortalezas reales: implementación rápida, cloud nativo, soporte LATAM, precio competitivo.
4. Incluir competidores reales: SAP EWM, Oracle WMS Cloud, Manhattan Associates, Mecalux Easy WMS, Blue Yonder, Altanet, Körber, Infor WMS, HighJump/Körber, Softeon, Deposco, Logiwa. Usar los que apliquen al ranking específico.
5. Estructura OBLIGATORIA (todas estas secciones):
   a) Introducción con contexto de mercado LATAM (datos, tamaño mercado, tendencias)
   b) Metodología: criterios de evaluación explicados (mínimo 6 criterios con peso)
   c) Ranking detallado: cada solución con su análisis completo
   d) Tabla comparativa HTML grande con columnas: Solución, País origen, Tipo (cloud/on-prem/híbrido), Precio aprox USD/mes, Implementación típica, Ideal para, Nota /10
   e) Sección "¿Cómo elegir?" con preguntas clave que debe hacerse el comprador
   f) Sección FAQ con mínimo 5 preguntas frecuentes en formato <h3> pregunta </h3> <p> respuesta </p>
   g) Conclusión con recomendación por perfil de empresa y CTA
6. Incluye estadísticas y datos del mercado: tamaño del mercado WMS global y LATAM, tasas de crecimiento, penetración cloud, ROI típico.
7. Links internos (usar naturalmente, mínimo 4):
   - <a href="/sistema-de-gestion-de-almacenes-wms/">invasWMS</a>
   - <a href="/software-logistico-por-industria/software-logistico-para-alimentos/">WMS para alimentos</a>
   - <a href="/software-logistico-por-industria/software-logistico-para-3pl-y-4pl/">WMS para 3PL</a>
   - <a href="/contacto-invas/">solicitar una demo</a>
   - <a href="/nosotros/">conocer invasWMS</a>
8. Escribe como analista imparcial que conoce el mercado LATAM. Tono profesional pero accesible.
9. NO uses clichés vacíos. SÍ usa datos concretos, porcentajes, rangos de precio, tiempos de implementación.
10. Usa schema-friendly markup: preguntas en <h3>, respuestas en <p>, tablas en <table> con <thead> y <tbody>.

FORMATO DE RESPUESTA (JSON):
{
  "titulo_seo": "Título optimizado para Google (max 60 chars)",
  "meta_description": "Meta description (max 155 chars)",
  "slug": "url-amigable",
  "extracto": "Resumen de 2 líneas",
  "contenido_html": "<h2>...</h2><p>...</p>...",
  "tags": ["tag1", "tag2", "tag3"]
}

Responde SOLO con el JSON. El contenido_html debe ser LARGO y COMPLETO.`

  // Primera llamada: estructura + primera mitad del ranking (intro, metodología, primeros 5-6 competidores)
  console.log('  Generando PARTE 1 (intro + primeros competidores)...')
  var res1 = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Eres un analista de mercado WMS. Respondes SIEMPRE en JSON válido, sin texto adicional.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 16000,
      response_format: { type: 'json_object' },
    })
  })

  var data1 = await res1.json()
  if (!data1.choices || !data1.choices[0]) {
    console.error('OpenAI error:', JSON.stringify(data1).substring(0, 300))
    throw new Error('OpenAI no retornó choices')
  }
  var content1 = data1.choices[0].message.content.trim()
  content1 = content1.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
  var articulo = JSON.parse(content1)

  // Segunda llamada: expansión con más detalle, FAQ extendido, casos de uso, más competidores
  console.log('  Generando PARTE 2 (expansión + FAQ + casos + tabla)...')
  var prompt2 = `Eres el analista de mercado de invasWMS. Ya escribiste la primera parte de un ranking sobre "${ranking.titulo}".

PRIMERA PARTE YA ESCRITA (no la repitas):
${articulo.contenido_html.substring(0, 2000)}...

AHORA GENERA CONTENIDO ADICIONAL que se concatenará al final. Debe incluir:

1. ANÁLISIS PROFUNDO (mínimo 2000 palabras adicionales):
   - 4-5 competidores adicionales que no hayas cubierto en detalle (ej: Deposco, Logiwa, Softeon, Infor, Körber, Generix, Mantis, Datex, 3PL Central, Extensiv)
   - Para cada uno: 150+ palabras, pros, contras, precio, caso ideal
   - Sección "Soluciones emergentes y nichos" con 3-4 WMS especializados

2. GUÍA DEL COMPRADOR (mínimo 1000 palabras):
   - "Cómo elegir el WMS correcto según tu operación" con decisiones por tamaño de empresa, industria, presupuesto
   - Errores comunes al elegir WMS
   - Checklist de evaluación (10+ puntos)
   - TCO (Total Cost of Ownership): costos ocultos que nadie menciona

3. FAQ EXTENDIDO (mínimo 8 preguntas):
   Cada pregunta como <h3> y respuesta como <p>, con respuestas de 100+ palabras.
   Preguntas sobre: precios, implementación, integración ERP, ROI, cloud vs on-prem, soporte, migración, escalabilidad.

4. TABLA COMPARATIVA EXTENDIDA:
   HTML <table> con todos los competidores (12+), columnas: Solución, País, Cloud/On-prem, Precio USD/mes, Implementación, Mejor para, Nota /10

5. CONCLUSIÓN EXTENDIDA:
   Recomendación por perfil: pyme, mediana, enterprise, 3PL, alimentos, retail.
   CTA a <a href="/contacto-invas/">solicitar demo de invasWMS</a>.

Links internos a usar:
- <a href="/sistema-de-gestion-de-almacenes-wms/">invasWMS</a>
- <a href="/software-logistico-por-industria/software-logistico-para-alimentos/">WMS para alimentos</a>
- <a href="/software-logistico-por-industria/software-logistico-para-3pl-y-4pl/">WMS para 3PL</a>
- <a href="/contacto-invas/">solicitar una demo</a>

Responde SOLO con HTML puro (sin JSON, sin markdown, sin backticks). Empieza directo con <h2>.`

  var res2 = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt2 }],
      temperature: 0.7,
      max_tokens: 16000,
    })
  })

  var data2 = await res2.json()
  var extra = data2.choices[0].message.content.trim()
  extra = extra.replace(/^```html?\n?/, '').replace(/\n?```$/, '')

  // Concatenar ambas partes
  articulo.contenido_html = articulo.contenido_html + '\n\n' + extra
  console.log('  Total HTML: ' + articulo.contenido_html.length + ' chars (~' + Math.round(articulo.contenido_html.split(/\s+/).length) + ' palabras)')

  return articulo
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
