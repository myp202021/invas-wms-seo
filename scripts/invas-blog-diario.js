// invas-blog-diario.js
// Genera 1 artículo de blog diario para invaswms.com
// Publica via WordPress REST API
// Corre via GitHub Actions L-V a las 07:00 AM Chile
//
// Uso: node scripts/invas-blog-diario.js
// Requiere: OPENAI_API_KEY, INVAS_WP_USER, INVAS_WP_APP_PASSWORD, INVAS_WP_URL

var fetch = globalThis.fetch || require('node-fetch')

var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var OPENAI_KEY = process.env.OPENAI_API_KEY
var RESEND_KEY = process.env.RESEND
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

if (!OPENAI_KEY) { console.error('OPENAI_API_KEY requerida'); process.exit(1) }

// ═══════════════════════════════════════════
// TEMAS PREDEFINIDOS (40+ temas en rotación)
// ═══════════════════════════════════════════
var TEMAS = [
  // WMS General
  { titulo: 'Qué es un WMS y por qué tu empresa lo necesita', categoria: 'WMS', keywords: 'qué es un WMS, sistema de gestión de almacenes, WMS definición', tipo: 'educativo' },
  { titulo: 'Tipos de WMS: cloud vs on-premise vs híbrido', categoria: 'WMS', keywords: 'tipos de WMS, WMS cloud, WMS on premise', tipo: 'comparativo' },
  { titulo: 'WMS vs ERP: diferencias y cuándo necesitas cada uno', categoria: 'WMS', keywords: 'WMS vs ERP, diferencia WMS ERP', tipo: 'comparativo' },
  { titulo: 'Cómo elegir el WMS adecuado para tu operación', categoria: 'WMS', keywords: 'cómo elegir WMS, seleccionar sistema WMS', tipo: 'guía' },
  { titulo: 'Los 7 errores más comunes al implementar un WMS', categoria: 'WMS', keywords: 'errores implementación WMS, problemas WMS', tipo: 'educativo' },
  { titulo: 'ROI de un WMS: cómo calcular el retorno de inversión', categoria: 'WMS', keywords: 'ROI WMS, retorno inversión WMS', tipo: 'educativo' },
  { titulo: 'Indicadores clave (KPIs) para medir tu operación de almacén', categoria: 'WMS', keywords: 'KPIs almacén, indicadores logísticos, métricas WMS', tipo: 'educativo' },
  { titulo: 'Automatización de bodegas: del picking manual al WMS inteligente', categoria: 'WMS', keywords: 'automatización bodega, picking automático, WMS inteligente', tipo: 'tendencia' },

  // Industria Alimentos
  { titulo: 'WMS para alimentos: control de cadena de frío y trazabilidad', categoria: 'Industria', keywords: 'WMS alimentos, cadena de frío, trazabilidad alimentos', tipo: 'industria' },
  { titulo: 'FIFO vs FEFO: qué método usar en tu almacén de alimentos', categoria: 'Industria', keywords: 'FIFO FEFO alimentos, gestión vencimientos almacén', tipo: 'educativo' },
  { titulo: 'Normativa sanitaria y WMS: cómo cumplir sin complicaciones', categoria: 'Industria', keywords: 'normativa sanitaria almacén, regulación alimentos WMS', tipo: 'guía' },
  { titulo: 'Cómo reducir mermas en la distribución de alimentos con tecnología', categoria: 'Industria', keywords: 'reducir mermas alimentos, pérdida alimentos distribución', tipo: 'educativo' },

  // Industria 3PL
  { titulo: 'WMS para operadores logísticos 3PL: gestión multi-cliente', categoria: 'Industria', keywords: 'WMS 3PL, operador logístico WMS, multi-cliente', tipo: 'industria' },
  { titulo: 'Facturación por actividad en 3PL: cómo hacerlo bien con un WMS', categoria: 'Industria', keywords: 'facturación actividad 3PL, cobro por servicio logístico', tipo: 'guía' },
  { titulo: 'SLA en operaciones 3PL: cómo medirlos y cumplirlos', categoria: 'Industria', keywords: 'SLA 3PL, acuerdo nivel servicio logística', tipo: 'educativo' },

  // Industria Retail
  { titulo: 'WMS para retail omnicanal: fulfillment desde la tienda y el CD', categoria: 'Industria', keywords: 'WMS retail omnicanal, fulfillment tienda, ship from store', tipo: 'industria' },
  { titulo: 'Preparación de pedidos e-commerce: picking por olas vs por pedido', categoria: 'Industria', keywords: 'picking ecommerce, picking por olas, preparación pedidos', tipo: 'educativo' },
  { titulo: 'Peak season: cómo preparar tu almacén para Cyber Day y Black Friday', categoria: 'Industria', keywords: 'peak season almacén, Cyber Day logística, preparar bodega', tipo: 'estacional' },

  // Tendencias
  { titulo: 'Inteligencia artificial en logística: casos reales en Latinoamérica', categoria: 'Tendencias', keywords: 'IA logística, inteligencia artificial almacén, IA Latinoamérica', tipo: 'tendencia' },
  { titulo: 'WMS en la nube: por qué 2026 es el año del cloud en logística', categoria: 'Tendencias', keywords: 'WMS cloud 2026, WMS en la nube, cloud logística', tipo: 'tendencia' },
  { titulo: 'Sostenibilidad en almacenes: cómo la tecnología reduce la huella', categoria: 'Tendencias', keywords: 'sostenibilidad almacén, logística verde, reducir huella carbono', tipo: 'tendencia' },
  { titulo: 'Robótica y WMS: cómo trabajan juntos en el almacén del futuro', categoria: 'Tendencias', keywords: 'robótica almacén, robots WMS, automatización logística', tipo: 'tendencia' },
  { titulo: 'La cadena de suministro post-pandemia: lecciones para Latinoamérica', categoria: 'Tendencias', keywords: 'cadena suministro post pandemia, resiliencia supply chain', tipo: 'tendencia' },

  // Casos y datos — NOTA: NO generar casos de éxito genéricos sin empresa real.
  // Los casos de éxito se publican manualmente con datos verificados del cliente.
  // Temas de datos/benchmark sí se pueden generar automáticamente:
  { titulo: 'Benchmark logístico Chile 2026: costos, tiempos y eficiencia', categoria: 'Datos', keywords: 'benchmark logístico Chile, costos logísticos 2026, eficiencia almacén', tipo: 'datos' },
  { titulo: 'El mercado WMS en Latinoamérica: tamaño, players y proyecciones', categoria: 'Datos', keywords: 'mercado WMS Latinoamérica, industria WMS, software logístico mercado', tipo: 'datos' },

  // Operaciones
  { titulo: 'Inventario cíclico vs inventario completo: cuándo usar cada uno', categoria: 'Operaciones', keywords: 'inventario cíclico, conteo inventario, auditoría stock', tipo: 'educativo' },
  { titulo: 'Slotting: cómo optimizar la ubicación de productos en tu almacén', categoria: 'Operaciones', keywords: 'slotting almacén, ubicación productos, optimizar bodega', tipo: 'guía' },
  { titulo: 'Cross-docking: qué es y cómo implementarlo con WMS', categoria: 'Operaciones', keywords: 'cross docking, cross docking WMS, logística directa', tipo: 'educativo' },
  { titulo: 'Last mile y WMS: cómo el almacén impacta la última milla', categoria: 'Operaciones', keywords: 'last mile WMS, última milla almacén, despacho eficiente', tipo: 'educativo' },
  { titulo: 'Gestión de devoluciones: logística inversa con WMS', categoria: 'Operaciones', keywords: 'logística inversa, devoluciones WMS, reverse logistics', tipo: 'guía' },

  // Comparativas
  { titulo: 'invasWMS vs SAP EWM: comparativa para operaciones en LATAM', categoria: 'Comparativa', keywords: 'invasWMS vs SAP, comparativa WMS, SAP EWM alternativa', tipo: 'comparativo' },
  { titulo: 'invasWMS vs Manhattan Associates: cuál elegir en Latinoamérica', categoria: 'Comparativa', keywords: 'invasWMS vs Manhattan, WMS comparativa, Manhattan WMS alternativa', tipo: 'comparativo' },
  { titulo: 'WMS para pymes vs WMS enterprise: diferencias reales', categoria: 'Comparativa', keywords: 'WMS pymes, WMS enterprise, WMS según tamaño empresa', tipo: 'comparativo' },

  // Chile / LATAM específico
  { titulo: 'Los 10 mejores WMS disponibles en Chile (2026)', categoria: 'Rankings', keywords: 'mejores WMS Chile, top WMS Chile 2026, ranking WMS', tipo: 'ranking' },
  { titulo: 'Logística en Chile: desafíos y oportunidades para 2026', categoria: 'LATAM', keywords: 'logística Chile 2026, desafíos logísticos Chile, supply chain Chile', tipo: 'datos' },
  { titulo: 'Costos logísticos en Latinoamérica: cómo reducirlos con tecnología', categoria: 'LATAM', keywords: 'costos logísticos Latinoamérica, reducir costos logística', tipo: 'educativo' },

  // Implementación
  { titulo: 'Guía paso a paso: cómo implementar un WMS en menos de 30 días', categoria: 'Guías', keywords: 'implementar WMS, guía implementación WMS, WMS rápido', tipo: 'guía' },
  { titulo: 'Capacitación de equipos en WMS: mejores prácticas', categoria: 'Guías', keywords: 'capacitación WMS, entrenar equipo WMS, adopción tecnología', tipo: 'guía' },
  { titulo: 'Migración de WMS: cómo cambiar de sistema sin perder datos', categoria: 'Guías', keywords: 'migración WMS, cambiar sistema WMS, migrar datos almacén', tipo: 'guía' },

  // === PILARES CAMILA (jun 2026) — FAQ, B2B, industria, geo ===

  // FAQ Estructurado (SEO quick wins)
  { titulo: 'FAQ: ¿Cuánto cuesta implementar un WMS en Chile?', categoria: 'FAQ', keywords: 'cuánto cuesta WMS Chile, precio WMS, costo implementación WMS', tipo: 'faq' },
  { titulo: 'FAQ: ¿Qué es un WMS y cómo se diferencia de un ERP?', categoria: 'FAQ', keywords: 'qué es WMS, diferencia WMS ERP, sistema gestión almacenes', tipo: 'faq' },
  { titulo: 'FAQ: ¿Cuánto tiempo toma implementar un WMS?', categoria: 'FAQ', keywords: 'tiempo implementación WMS, plazo WMS, implementar WMS rápido', tipo: 'faq' },
  { titulo: 'FAQ: ¿Un WMS se integra con mi ERP actual?', categoria: 'FAQ', keywords: 'integración WMS ERP, WMS compatible SAP, WMS API integración', tipo: 'faq' },
  { titulo: 'FAQ: ¿Qué ROI puedo esperar de un WMS en el primer año?', categoria: 'FAQ', keywords: 'ROI WMS primer año, retorno inversión WMS, ahorro WMS', tipo: 'faq' },
  { titulo: 'FAQ: ¿WMS cloud o WMS on-premise para mi operación?', categoria: 'FAQ', keywords: 'WMS cloud vs on premise, WMS nube, WMS servidor local', tipo: 'faq' },

  // Contenido B2B — Comité de compras
  { titulo: 'Guía para gerentes: cómo justificar la inversión en WMS ante directorio', categoria: 'B2B', keywords: 'justificar inversión WMS, business case WMS, presentar WMS directorio', tipo: 'guía' },
  { titulo: 'Checklist para evaluar proveedores de WMS en Chile', categoria: 'B2B', keywords: 'evaluar WMS Chile, checklist proveedor WMS, comparar WMS', tipo: 'guía' },
  { titulo: 'Cómo armar un RFP para seleccionar tu WMS', categoria: 'B2B', keywords: 'RFP WMS, request for proposal WMS, licitación WMS', tipo: 'guía' },
  { titulo: 'WMS para CFOs: métricas financieras que importan', categoria: 'B2B', keywords: 'WMS métricas financieras, CFO logística, costo por línea despachada', tipo: 'educativo' },
  { titulo: 'WMS para gerentes de operaciones: KPIs que debes monitorear', categoria: 'B2B', keywords: 'KPIs operaciones WMS, gerente operaciones logística, indicadores bodega', tipo: 'educativo' },

  // Industrias expandidas (polos logísticos regionales)
  { titulo: 'WMS para la industria minera: gestión de bodegas en faenas remotas', categoria: 'Industria', keywords: 'WMS minería, bodega faena minera, gestión almacén minería Chile', tipo: 'industria' },
  { titulo: 'WMS para distribuidoras farmacéuticas: trazabilidad y cadena de frío', categoria: 'Industria', keywords: 'WMS farmacéutica, trazabilidad medicamentos, cadena frío farmacia', tipo: 'industria' },
  { titulo: 'WMS para centros de distribución portuarios: Valparaíso y San Antonio', categoria: 'Industria', keywords: 'WMS portuario, centro distribución Valparaíso, logística San Antonio', tipo: 'industria' },
  { titulo: 'WMS para zonas francas: gestión logística en Iquique y Punta Arenas', categoria: 'Industria', keywords: 'WMS zona franca, logística Iquique, almacén Punta Arenas', tipo: 'industria' },
  { titulo: 'WMS para agroindustria: trazabilidad de exportaciones frutícolas', categoria: 'Industria', keywords: 'WMS agroindustria, trazabilidad fruta exportación, logística agrícola Chile', tipo: 'industria' },
  { titulo: 'Logística en Antofagasta: desafíos del almacenamiento minero e industrial', categoria: 'Industria', keywords: 'logística Antofagasta, almacén minero, WMS norte Chile', tipo: 'industria' },
  { titulo: 'Hubs logísticos del Biobío: oportunidades para WMS en la zona sur', categoria: 'Industria', keywords: 'logística Biobío, hub logístico Concepción, WMS sur Chile', tipo: 'industria' },

  // Operaciones avanzadas
  { titulo: 'Voice picking y WMS: cómo funciona la preparación por voz', categoria: 'Operaciones', keywords: 'voice picking, picking por voz, WMS voz almacén', tipo: 'educativo' },
  { titulo: 'WMS y WhatsApp: notificaciones de despacho en tiempo real', categoria: 'Operaciones', keywords: 'WMS WhatsApp, notificación despacho, alertas logísticas', tipo: 'educativo' },
  { titulo: 'Cómo reducir el costo por línea despachada con un WMS', categoria: 'Operaciones', keywords: 'costo por línea despachada, eficiencia despacho, reducir costos logísticos', tipo: 'educativo' },
]

// ═══════════════════════════════════════════
// FUNCIONES
// ═══════════════════════════════════════════

async function verificarPublicadoHoy() {
  var hoy = new Date().toISOString().split('T')[0]
  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?after=' + hoy + 'T00:00:00&status=publish&per_page=5', {
    headers: { 'Authorization': AUTH }
  })
  var posts = await res.json()
  return Array.isArray(posts) && posts.length > 0
}

async function obtenerPostsExistentes() {
  var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?per_page=50&_fields=title,slug', {
    headers: { 'Authorization': AUTH }
  })
  var posts = await res.json()
  return posts.map(function(p) { return p.title.rendered.toLowerCase() })
}

function seleccionarTema(existentes) {
  // Filtrar temas ya publicados
  var disponibles = TEMAS.filter(function(t) {
    return !existentes.some(function(e) {
      return e.includes(t.titulo.substring(0, 30).toLowerCase())
    })
  })
  if (disponibles.length === 0) disponibles = TEMAS // Si ya se publicaron todos, reiniciar
  // Aleatorio
  return disponibles[Math.floor(Math.random() * disponibles.length)]
}

async function generarArticulo(tema) {
  var prompt = `Eres el content manager de invasWMS, un software WMS (Warehouse Management System) 100% en la nube para Latinoamérica. Genera un artículo de blog profesional.

DATOS DE invasWMS para mencionar naturalmente:
- +700 sitios conectados en América
- +250.000 líneas despachadas diariamente
- +1.800 usuarios conectados
- Presencia en Chile, Colombia, México, Perú y USA
- Caso: +400% capacidad de despacho en 30 días
- Caso: -60% tiempo de preparación de pedidos
- Caso: -25% errores de picking
- Implementación en menos de 30 días
- 100% cloud, escalable, resiliente

TEMA DEL ARTÍCULO: ${tema.titulo}
KEYWORDS TARGET: ${tema.keywords}
TIPO: ${tema.tipo}

INSTRUCCIONES:
1. Escribe en español profesional pero accesible. No uses jerga innecesaria.
2. Mínimo 2500 palabras, máximo 3500. Artículos largos y completos.
3. Estructura con H2 (mínimo 5 secciones) y H3 donde aplique.
4. Incluye datos concretos, estadísticas del mercado WMS y ejemplos reales.
5. Menciona invasWMS de forma natural 2-3 veces (no más), como solución relevante.
6. Incluye links internos como HTML:
   - <a href="/sistema-de-gestion-de-almacenes-wms/">invasWMS</a>
   - <a href="/software-logistico-por-industria/software-logistico-para-alimentos/">WMS para alimentos</a>
   - <a href="/software-logistico-por-industria/software-logistico-para-3pl-y-4pl/">WMS para 3PL</a>
   - <a href="/contacto-invas/">solicitar una demo</a>
7. Al final, incluye una sección de conclusión con CTA suave hacia invasWMS.
8. NO uses frases como "en el vertiginoso mundo", "sinergia", "potenciar", "apalancarse".
9. Escribe como si fueras un experto en logística que comparte conocimiento.

FORMATO DE RESPUESTA (JSON):
{
  "titulo_seo": "Título optimizado para Google (max 60 chars)",
  "meta_description": "Meta description (max 155 chars)",
  "slug": "url-amigable-del-articulo",
  "extracto": "Resumen de 2 líneas para el listado del blog",
  "contenido_html": "<h2>...</h2><p>...</p>...",
  "categoria": "${tema.categoria}",
  "tags": ["tag1", "tag2", "tag3"]
}

Responde SOLO con el JSON, sin texto adicional.`

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
  // Limpiar markdown code blocks si los tiene
  content = content.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(content)
}

async function obtenerOCrearCategoria(nombre) {
  // Buscar categoría existente
  var res = await fetch(WP_URL + '/wp-json/wp/v2/categories?search=' + encodeURIComponent(nombre), {
    headers: { 'Authorization': AUTH }
  })
  var cats = await res.json()
  if (cats.length > 0) return cats[0].id

  // Crear categoría
  var res2 = await fetch(WP_URL + '/wp-json/wp/v2/categories', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nombre })
  })
  var cat = await res2.json()
  return cat.id
}

async function generarImagenDestacada(titulo) {
  var prompt = 'Professional photograph of a modern warehouse or logistics center related to: ' + titulo.substring(0, 100) + '. Clean, well-lit industrial space with organized shelving, automated systems, or workers with tablets. Corporate style, no text overlay, no logos, no watermarks.'
  try {
    var res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + OPENAI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-image-1', prompt: prompt, n: 1, size: '1536x1024', quality: 'low' })
    })
    var data = await res.json()
    if (data.data && data.data[0]) {
      var b64 = data.data[0].b64_json
      var url = data.data[0].url
      if (b64) return { type: 'b64', data: b64 }
      if (url) return { type: 'url', data: url }
    }
  } catch (e) { console.log('  ⚠️ Error generando imagen: ' + e.message) }
  return null
}

async function subirImagenAWordPress(imageData, titulo) {
  try {
    var imgBuffer
    if (imageData.type === 'b64') {
      imgBuffer = Buffer.from(imageData.data, 'base64')
    } else {
      var imgRes = await fetch(imageData.data)
      imgBuffer = Buffer.from(await imgRes.arrayBuffer())
    }
    var slug = titulo.substring(0, 50).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    var res = await fetch(WP_URL + '/wp-json/wp/v2/media', {
      method: 'POST',
      headers: {
        'Authorization': AUTH,
        'Content-Disposition': 'attachment; filename="blog-' + slug + '.png"',
        'Content-Type': 'image/png',
      },
      body: imgBuffer,
    })
    var media = await res.json()
    if (media.id) return media.id
  } catch (e) { console.log('  ⚠️ Error subiendo imagen: ' + e.message) }
  return null
}

async function publicarEnWordPress(articulo) {
  var catId = await obtenerOCrearCategoria(articulo.categoria)

  // Generar y subir imagen destacada
  var featuredMedia = 0
  console.log('  Generando imagen destacada...')
  var imageData = await generarImagenDestacada(articulo.titulo_seo)
  if (imageData) {
    var mediaId = await subirImagenAWordPress(imageData, articulo.titulo_seo)
    if (mediaId) {
      featuredMedia = mediaId
      console.log('  ✅ Imagen generada y subida (media ' + mediaId + ')')
    }
  }

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
      featured_media: featuredMedia,
      meta: {
        rank_math_title: articulo.titulo_seo + ' | invasWMS Blog',
        rank_math_description: articulo.meta_description,
        rank_math_focus_keyword: articulo.tags ? articulo.tags[0] : '',
      }
    })
  })

  var post = await res.json()
  return post
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
        subject: '📝 Blog invasWMS: ' + articulo.titulo_seo,
        html: '<div style="font-family:sans-serif;max-width:500px">'
          + '<h2 style="color:#1a1a2e">Nuevo artículo publicado en invasWMS</h2>'
          + '<p><strong>' + articulo.titulo_seo + '</strong></p>'
          + '<p>' + articulo.meta_description + '</p>'
          + '<p>Categoría: ' + articulo.categoria + '</p>'
          + '<p><a href="' + postUrl + '" style="color:#2563EB">Ver artículo →</a></p>'
          + '</div>'
      })
    })
  } catch (e) { console.log('Email notification failed (non-critical)') }
}

// ═══════════════════════════════════════════
// REGENERAR PÁGINA BLOG (ID 6149)
// ═══════════════════════════════════════════
var BLOG_PAGE_ID = 6149

async function regenerarPaginaBlog() {
  // Get all posts
  var allPosts = []
  for (var pg = 1; pg <= 5; pg++) {
    var res = await fetch(WP_URL + '/wp-json/wp/v2/posts?per_page=100&status=publish&_fields=id,title,link,featured_media,categories,date&page=' + pg, {
      headers: { 'Authorization': AUTH }
    })
    var posts = await res.json()
    if (!Array.isArray(posts) || !posts.length) break
    allPosts = allPosts.concat(posts)
  }

  // Get media URLs
  var mids = []
  allPosts.forEach(function(p) { if (p.featured_media && mids.indexOf(p.featured_media) === -1) mids.push(p.featured_media) })
  var mediaMap = {}
  for (var i = 0; i < mids.length; i += 100) {
    var batch = mids.slice(i, i + 100)
    var mRes = await fetch(WP_URL + '/wp-json/wp/v2/media?include=' + batch.join(',') + '&per_page=100&_fields=id,source_url', {
      headers: { 'Authorization': AUTH }
    })
    var medias = await mRes.json()
    medias.forEach(function(m) { mediaMap[m.id] = m.source_url })
  }

  // Get categories
  var catRes = await fetch(WP_URL + '/wp-json/wp/v2/categories?per_page=100&_fields=id,name,slug,count,link', {
    headers: { 'Authorization': AUTH }
  })
  var cats = await catRes.json()
  var mainCats = cats.filter(function(c) {
    return c.count > 0 && ['uncategorized','uncategorized-en','sin-categoria','technical-documents','success-stories','news'].indexOf(c.slug) === -1
  }).sort(function(a, b) { return b.count - a.count })

  // Build HTML
  var html = '<style>.bh{background:linear-gradient(135deg,#0a1628,#1a365d,#0a1628);padding:50px 30px;text-align:center;border-radius:12px;margin-bottom:32px}.bh h1{color:#fff;font-size:36px;font-weight:800;margin:0 0 12px}.bh p{color:rgba(255,255,255,.6);font-size:16px;margin:0 auto;max-width:550px}.bf{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:36px}.bf a{padding:7px 18px;background:#edf2f7;color:#1a365d;border-radius:20px;text-decoration:none;font-size:13px;font-weight:600;transition:all .2s}.bf a:hover{background:#3182ce;color:#fff}.bs h2{font-size:24px;font-weight:700;color:#1a365d;margin:40px 0 20px;padding-bottom:10px;border-bottom:3px solid #3182ce}.bg{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;margin-bottom:24px}.bc{text-decoration:none;display:block;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.07);transition:transform .2s,box-shadow .2s}.bc:hover{transform:translateY(-3px);box-shadow:0 6px 20px rgba(0,0,0,.12)}.bc img{width:100%;height:180px;object-fit:cover}.bc h3{font-size:15px;font-weight:700;color:#1a202c;margin:0;line-height:1.4;padding:16px}.ct{background:linear-gradient(135deg,#1a365d,#2b6cb0);padding:40px;text-align:center;border-radius:12px;margin-top:40px}.ct h2{color:#fff;font-size:24px;margin:0 0 10px}.ct p{color:rgba(255,255,255,.6);margin:0 0 20px}.ct a{display:inline-block;padding:12px 28px;background:#fff;color:#1a365d;font-weight:700;border-radius:8px;text-decoration:none}</style>'

  html += '<div class="bh"><h1>Blog invasWMS</h1><p>Artículos, guías, casos de éxito y FAQ sobre gestión de almacenes y logística</p></div>'
  html += '<div class="bf">'
  mainCats.forEach(function(c) { html += '<a href="' + c.link + '">' + c.name + ' (' + c.count + ')</a>' })
  html += '</div>'

  var sections = [
    { name: 'Casos de Éxito', ids: [53] },
    { name: 'Preguntas Frecuentes', ids: [112] },
    { name: 'Rankings y Comparativas', ids: [94, 108] },
    { name: 'Industrias', ids: [92] },
    { name: 'Tendencias', ids: [100] },
    { name: 'Operaciones', ids: [102] },
    { name: 'Guías y Documentos', ids: [57, 98, 96, 110, 104, 106] },
  ]

  var used = {}
  html += '<div class="bs">'
  sections.forEach(function(sec) {
    var sp = allPosts.filter(function(p) {
      if (used[p.id]) return false
      return p.categories.some(function(c) { return sec.ids.indexOf(c) !== -1 })
    })
    if (!sp.length) return
    sp.forEach(function(p) { used[p.id] = true })
    html += '<h2>' + sec.name + '</h2><div class="bg">'
    sp.forEach(function(p) {
      var img = mediaMap[p.featured_media] || ''
      html += '<a class="bc" href="' + p.link + '">'
      if (img) html += '<img src="' + img + '" alt="' + (p.title.rendered || '').replace(/"/g, '&quot;') + '" loading="lazy">'
      html += '<h3>' + p.title.rendered + '</h3></a>'
    })
    html += '</div>'
  })
  var rem = allPosts.filter(function(p) { return !used[p.id] })
  if (rem.length) {
    html += '<h2>Más artículos</h2><div class="bg">'
    rem.forEach(function(p) {
      var img = mediaMap[p.featured_media] || ''
      html += '<a class="bc" href="' + p.link + '">'
      if (img) html += '<img src="' + img + '" alt="' + (p.title.rendered || '').replace(/"/g, '&quot;') + '" loading="lazy">'
      html += '<h3>' + p.title.rendered + '</h3></a>'
    })
    html += '</div>'
  }
  html += '</div>'
  html += '<div class="ct"><h2>¿Listo para optimizar tu almacén?</h2><p>Agenda una demo personalizada</p><a href="/contacto-invas/">Solicitar demo →</a></div>'

  // Update page
  await fetch(WP_URL + '/wp-json/wp/v2/pages/' + BLOG_PAGE_ID, {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: html })
  })
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  INVAS WMS — BLOG DIARIO')
  console.log('  ' + new Date().toISOString().split('T')[0])
  console.log('═══════════════════════════════════════════\n')

  // 1. Verificar si ya se publicó hoy
  var yaPublicado = await verificarPublicadoHoy()
  if (yaPublicado) {
    console.log('Ya se publicó un artículo hoy. Saltando.')
    return
  }

  // 2. Obtener posts existentes para no repetir
  var existentes = await obtenerPostsExistentes()
  console.log('Posts existentes: ' + existentes.length)

  // 3. Seleccionar tema
  var tema = seleccionarTema(existentes)
  console.log('Tema seleccionado: ' + tema.titulo)
  console.log('Keywords: ' + tema.keywords)
  console.log('Tipo: ' + tema.tipo)

  // 4. Generar artículo con OpenAI
  console.log('\nGenerando artículo con GPT-4o...')
  var articulo = await generarArticulo(tema)
  console.log('Artículo generado: ' + articulo.titulo_seo)
  console.log('Slug: ' + articulo.slug)
  console.log('Largo HTML: ' + (articulo.contenido_html || '').length + ' chars')

  // 5. Publicar en WordPress
  console.log('\nPublicando en WordPress...')
  var post = await publicarEnWordPress(articulo)

  if (post.id) {
    var postUrl = post.link || (WP_URL + '/' + articulo.slug + '/')
    console.log('\n✅ PUBLICADO')
    console.log('   ID: ' + post.id)
    console.log('   URL: ' + postUrl)
    console.log('   Título: ' + articulo.titulo_seo)
    console.log('   Categoría: ' + articulo.categoria)

    // 6. Notificar
    await notificarEmail(articulo, postUrl)
    console.log('   Email: enviado a contacto@mulleryperez.cl + jvio + cvilo@impruvex.com')

    // 7. Regenerar página /todos-los-articulos/ (ID 6149)
    console.log('\n   Regenerando página de blog...')
    await regenerarPaginaBlog()
    console.log('   ✅ Página /todos-los-articulos/ actualizada')

    // Outputs para GitHub Actions
    console.log('\n::set-output name=title::' + articulo.titulo_seo)
    console.log('::set-output name=url::' + postUrl)
    console.log('::set-output name=category::' + articulo.categoria)
  } else {
    console.error('❌ Error publicando:', JSON.stringify(post).substring(0, 200))
    process.exit(1)
  }
}

main().catch(function(e) {
  console.error('Error fatal:', e.message)
  process.exit(1)
})
