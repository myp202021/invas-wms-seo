// crear-faq-pages.js
// Crea páginas FAQ optimizadas SEO para invaswms.com
// Cada FAQ tiene schema FAQPage, meta description, H1, H2, etc.
//
// Uso: OPENAI_API_KEY=xxx node scripts/crear-faq-pages.js

var fetch = globalThis.fetch || require('node-fetch')

var WP_URL = 'https://www.invaswms.com'
var WP_USER = 'Ad-invas-miN'
var WP_PASS = 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var OPENAI_KEY = process.env.OPENAI_API_KEY
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

if (!OPENAI_KEY) { console.error('OPENAI_API_KEY requerida'); process.exit(1) }

// ═══════════════════════════════════════════
// FAQ TOPICS — cada uno será un post largo con schema FAQPage
// ═══════════════════════════════════════════
var FAQ_TOPICS = [
  {
    titulo: 'Preguntas Frecuentes sobre WMS: Todo lo que Necesitas Saber',
    slug: 'faq-wms-preguntas-frecuentes',
    keywords: 'preguntas frecuentes WMS, FAQ WMS, qué es un WMS',
    meta: 'Resolvemos las preguntas más frecuentes sobre sistemas WMS: qué es, cuánto cuesta, cómo se implementa, integración con ERP y más.',
    preguntas: [
      '¿Qué es un WMS y para qué sirve?',
      '¿Cuál es la diferencia entre un WMS y un ERP?',
      '¿Cuánto cuesta implementar un WMS?',
      '¿Cuánto tiempo toma implementar un WMS?',
      '¿Un WMS se integra con mi ERP actual (SAP, Oracle, etc.)?',
      '¿Qué beneficios concretos tiene un WMS?',
      '¿Qué empresas necesitan un WMS?',
      '¿WMS cloud o WMS on-premise?',
      '¿Cómo se calcula el ROI de un WMS?',
      '¿Qué pasa con mis datos si cambio de WMS?',
      '¿Necesito capacitar a todo mi equipo?',
      '¿Un WMS funciona para múltiples bodegas?',
    ],
  },
  {
    titulo: 'FAQ WMS para Alimentos: Trazabilidad, FIFO y Cadena de Frío',
    slug: 'faq-wms-alimentos-trazabilidad',
    keywords: 'WMS alimentos, trazabilidad alimentos, FIFO FEFO bodega, cadena frío WMS',
    meta: 'Preguntas frecuentes sobre WMS para la industria alimentaria: trazabilidad, FIFO vs FEFO, cadena de frío, normativa sanitaria y más.',
    preguntas: [
      '¿Cómo gestiona un WMS la trazabilidad de alimentos?',
      '¿Cuál es la diferencia entre FIFO y FEFO en un WMS?',
      '¿Un WMS controla la cadena de frío?',
      '¿Cómo ayuda un WMS a cumplir la normativa sanitaria?',
      '¿Se puede rastrear un lote desde la recepción hasta el despacho?',
      '¿Qué pasa con los productos próximos a vencer?',
      '¿Un WMS maneja fechas de vencimiento automáticamente?',
      '¿Cómo reduce un WMS las mermas en alimentos?',
      '¿invasWMS se integra con sistemas de control de temperatura?',
      '¿Qué certificaciones necesita un WMS para alimentos?',
    ],
  },
  {
    titulo: 'FAQ WMS para 3PL: Multicliente, SLA y Facturación',
    slug: 'faq-wms-3pl-operadores-logisticos',
    keywords: 'WMS 3PL, WMS operador logístico, multicliente WMS, SLA logística',
    meta: 'Preguntas frecuentes sobre WMS para operadores logísticos 3PL: gestión multicliente, SLA, facturación por servicio y escalabilidad.',
    preguntas: [
      '¿Cómo funciona un WMS multicliente para 3PL?',
      '¿Se pueden definir SLA diferentes por cliente?',
      '¿Un WMS para 3PL permite facturación por servicio logístico?',
      '¿Cómo gestiona un WMS el almacenamiento compartido vs dedicado?',
      '¿Se puede dar acceso limitado a cada cliente para ver su inventario?',
      '¿Qué pasa cuando un cliente 3PL crece y necesita más espacio?',
      '¿Un WMS ayuda a reducir errores en operaciones multicliente?',
      '¿Cómo se mide la rentabilidad por cliente en un WMS 3PL?',
      '¿invasWMS maneja cross-docking para 3PL?',
      '¿Qué reportes necesita un operador logístico de su WMS?',
    ],
  },
  {
    titulo: 'FAQ WMS Cloud vs On-Premise: Costos, Seguridad y Escalabilidad',
    slug: 'faq-wms-cloud-vs-on-premise',
    keywords: 'WMS cloud, WMS on premise, WMS nube costos, seguridad WMS cloud',
    meta: 'Cloud o servidor propio: resolvemos las dudas más comunes sobre WMS cloud vs on-premise, costos, seguridad, escalabilidad y migración.',
    preguntas: [
      '¿Qué diferencia hay entre un WMS cloud y uno on-premise?',
      '¿Es más caro un WMS cloud o un WMS on-premise?',
      '¿Qué tan seguro es un WMS en la nube?',
      '¿Puedo migrar de on-premise a cloud sin perder datos?',
      '¿Un WMS cloud funciona sin internet?',
      '¿Quién se encarga de las actualizaciones en un WMS cloud?',
      '¿Un WMS cloud escala si mi operación crece?',
      '¿Qué pasa con mis datos si cancelo el servicio cloud?',
      '¿Es mejor un WMS cloud para operaciones en múltiples países?',
      '¿Cuál es el tiempo de implementación de un WMS cloud vs on-premise?',
    ],
  },
  {
    titulo: 'FAQ Implementación de WMS: Plazos, Costos y Mejores Prácticas',
    slug: 'faq-implementacion-wms',
    keywords: 'implementar WMS, plazo implementación WMS, costo WMS Chile, migración WMS',
    meta: 'Todo sobre implementar un WMS: plazos reales, costos en Chile, capacitación, migración de datos, errores comunes y mejores prácticas.',
    preguntas: [
      '¿Cuánto tiempo toma implementar un WMS desde cero?',
      '¿Cuánto cuesta implementar un WMS en Chile?',
      '¿Qué datos necesito migrar al nuevo WMS?',
      '¿Puedo implementar un WMS por fases?',
      '¿Cuáles son los errores más comunes al implementar un WMS?',
      '¿Necesito detener mi operación durante la implementación?',
      '¿Cuántas personas necesitan capacitarse?',
      '¿Cómo elijo entre los diferentes WMS disponibles en Chile?',
      '¿Qué hardware necesito para un WMS (lectores, tablets, impresoras)?',
      '¿Cuándo empiezo a ver resultados después de implementar un WMS?',
    ],
  },
]

// ═══════════════════════════════════════════
// FUNCTIONS
// ═══════════════════════════════════════════

async function generarFAQ(topic) {
  var prompt = `Eres el content manager de invasWMS, un software WMS 100% cloud para Latinoamérica.

Genera un artículo tipo FAQ completo y profesional.

TEMA: ${topic.titulo}
KEYWORDS: ${topic.keywords}

PREGUNTAS A RESPONDER (en este orden):
${topic.preguntas.map(function(p, i) { return (i+1) + '. ' + p }).join('\n')}

INSTRUCCIONES:
1. Cada respuesta debe tener entre 150-300 palabras. Completas, con datos concretos.
2. Usa H2 para cada pregunta.
3. Incluye datos de invasWMS naturalmente (700+ sitios, 250K+ líneas diarias, implementación en 30 días, presencia Chile/Colombia/México/Perú/USA).
4. Menciona invasWMS 3-4 veces en todo el artículo como solución relevante.
5. Incluye links internos HTML:
   - <a href="/sistema-de-gestion-de-almacenes-wms/">invasWMS</a>
   - <a href="/software-logistico-por-industria/software-logistico-para-alimentos/">WMS para alimentos</a>
   - <a href="/software-logistico-por-industria/software-logistico-para-3pl-y-4pl/">WMS para 3PL</a>
   - <a href="/contacto-invas/">solicitar una demo</a>
6. Al inicio incluye un párrafo introductorio de 2-3 líneas.
7. Al final incluye una conclusión con CTA suave.
8. NO uses "en el vertiginoso mundo", "sinergia", "potenciar", "apalancarse".
9. Mínimo 2500 palabras total.

FORMATO JSON:
{
  "titulo_seo": "Título H1 optimizado (max 65 chars)",
  "meta_description": "Meta description (max 155 chars)",
  "contenido_html": "<p>Intro...</p><h2>Pregunta 1</h2><p>Respuesta...</p>...",
  "faq_schema": [
    { "question": "pregunta exacta", "answer": "respuesta resumida en 2-3 oraciones" },
    ...
  ]
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

async function generarImagen(titulo) {
  var prompt = 'Professional photograph of a modern warehouse or logistics center related to: ' + titulo.substring(0, 80) + '. Clean, well-lit industrial space. Corporate style, no text, no logos, no watermarks.'
  try {
    var res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'dall-e-3', prompt: prompt, n: 1, size: '1792x1024', quality: 'standard' })
    })
    var data = await res.json()
    if (data.data && data.data[0]) return data.data[0].url
  } catch (e) { console.log('  ⚠️ Error imagen: ' + e.message) }
  return null
}

async function subirImagen(imageUrl, slug) {
  try {
    var imgRes = await fetch(imageUrl)
    var imgBuffer = Buffer.from(await imgRes.arrayBuffer())
    var res = await fetch(WP_URL + '/wp-json/wp/v2/media', {
      method: 'POST',
      headers: {
        'Authorization': AUTH,
        'Content-Disposition': 'attachment; filename="faq-' + slug + '.png"',
        'Content-Type': 'image/png',
      },
      body: imgBuffer,
    })
    var media = await res.json()
    return media.id || null
  } catch (e) { console.log('  ⚠️ Error subiendo: ' + e.message) }
  return null
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

async function publicarFAQ(topic, faqData, mediaId) {
  var catId = await obtenerOCrearCategoria('FAQ')

  // Add FAQ schema script to the content
  var schemaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.faq_schema.map(function(item) {
      return {
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        }
      }
    })
  })

  var contentWithSchema = faqData.contenido_html
    + '\n\n<script type="application/ld+json">' + schemaJson + '</script>'

  var body = {
    title: faqData.titulo_seo,
    slug: topic.slug,
    content: contentWithSchema,
    excerpt: topic.meta,
    status: 'publish',
    categories: [catId],
    meta: {
      rank_math_title: faqData.titulo_seo + ' | invasWMS',
      rank_math_description: faqData.meta_description,
      rank_math_focus_keyword: topic.keywords.split(',')[0].trim(),
    }
  }
  if (mediaId) body.featured_media = mediaId

  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  return await res.json()
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  INVAS WMS — CREAR FAQ PAGES')
  console.log('  ' + new Date().toISOString())
  console.log('═══════════════════════════════════════════\n')

  for (var i = 0; i < FAQ_TOPICS.length; i++) {
    var topic = FAQ_TOPICS[i]
    console.log('\n[' + (i+1) + '/' + FAQ_TOPICS.length + '] ' + topic.titulo)

    // Check if already exists
    var checkRes = await fetch(WP_URL + '/wp-json/wp/v2/posts?slug=' + topic.slug + '&_fields=id', {
      headers: { 'Authorization': AUTH }
    })
    var existing = await checkRes.json()
    if (existing.length > 0) {
      console.log('  ⚠️ Ya existe (ID ' + existing[0].id + '), saltando')
      continue
    }

    // Generate FAQ content
    console.log('  Generando contenido con GPT-4o...')
    var faqData = await generarFAQ(topic)
    console.log('  ✅ Contenido generado: ' + (faqData.contenido_html || '').length + ' chars')
    console.log('  Schema: ' + (faqData.faq_schema || []).length + ' preguntas')

    // Generate image
    console.log('  Generando imagen...')
    var imageUrl = await generarImagen(topic.titulo)
    var mediaId = null
    if (imageUrl) {
      mediaId = await subirImagen(imageUrl, topic.slug)
      console.log('  ✅ Imagen subida (media ' + mediaId + ')')
    }

    // Publish
    console.log('  Publicando...')
    var post = await publicarFAQ(topic, faqData, mediaId)
    if (post.id) {
      console.log('  ✅ PUBLICADO — ID ' + post.id + ' — ' + (post.link || ''))
    } else {
      console.log('  ❌ Error: ' + JSON.stringify(post).substring(0, 200))
    }

    // Wait between posts
    await new Promise(function(r) { setTimeout(r, 5000) })
  }

  console.log('\n═══ FAQ PAGES DONE ═══')
}

main().catch(function(e) { console.error('FATAL:', e); process.exit(1) })
