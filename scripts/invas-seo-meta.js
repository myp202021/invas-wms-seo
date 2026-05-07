// invas-seo-meta.js
// Actualiza meta titles, descriptions y focus keywords de todas las páginas de invaswms.com
// Usa RankMath API (updateMeta endpoint)
// Uso: node scripts/invas-seo-meta.js

var fetch = require('node-fetch')

var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

// ═══════════════════════════════════════════
// SEO DATA POR PÁGINA
// ═══════════════════════════════════════════

var PAGES_ES = [
  {
    id: 1750, slug: 'inicio',
    title: 'invasWMS — Sistema WMS para Almacenes y Centros de Distribución | Chile y Latinoamérica',
    description: 'Software de gestión de almacenes 100% en la nube. +700 sitios conectados en América. Control de inventario, picking, despacho y trazabilidad. Solicita una demo.',
    keyword: 'sistema WMS',
  },
  {
    id: 3475, slug: 'sistema-de-gestion-de-almacenes-wms',
    title: 'Sistema WMS — Gestión de Almacenes y Bodegas en la Nube | invasWMS',
    description: 'invasWMS es un sistema de gestión de almacenes (WMS) cloud que optimiza picking, inventario, recepción y despacho. Implementación en menos de 30 días. +1.800 usuarios conectados.',
    keyword: 'sistema de gestión de almacenes WMS',
  },
  {
    id: 3587, slug: 'software-monitoreo-logistico',
    title: 'invasMONITOR — Monitoreo Logístico en Tiempo Real | invasWMS',
    description: 'Monitorea tus operaciones de almacén y distribución en tiempo real. KPIs de productividad, tiempos de picking, niveles de servicio. Tableros conectados a tu WMS.',
    keyword: 'monitoreo logístico en tiempo real',
  },
  {
    id: 3589, slug: 'plataforma-de-datos-logisticos',
    title: 'invasDATALAKE — Plataforma de Datos Logísticos | invasWMS',
    description: 'Centraliza la data de tu operación logística en una plataforma de datos integrada. Analytics avanzado, reportes automáticos, integraciones con tu ERP.',
    keyword: 'plataforma de datos logísticos',
  },
  {
    id: 1776, slug: 'empresa-de-software-logistico',
    title: 'Nosotros — invasWMS | Empresa de Software Logístico en Latinoamérica',
    description: 'invasWMS es una empresa de software logístico con sede en Chile, Colombia, México y USA. +700 sitios, +250.000 líneas despachadas, +1.800 usuarios. Conoce nuestro equipo.',
    keyword: 'empresa de software logístico',
  },
  {
    id: 3327, slug: 'software-logistico-por-industria',
    title: 'Software Logístico por Industria — WMS para Alimentos, Retail, 3PL, Salud | invasWMS',
    description: 'Soluciones WMS especializadas por industria: alimentos y cadena de frío, retail omnicanal, operadores logísticos 3PL/4PL, salud, tecnología y repuestos.',
    keyword: 'software logístico por industria',
  },
  {
    id: 3606, slug: 'software-logistico-para-alimentos',
    title: 'WMS para Alimentos y Cadena de Frío — Control de Lotes, FIFO, Trazabilidad | invasWMS',
    description: 'Sistema WMS especializado en distribución de alimentos. Control de vencimientos, FIFO automático, trazabilidad completa, cumplimiento normativo. Caso: -60% tiempo de picking.',
    keyword: 'WMS para alimentos',
  },
  {
    id: 3596, slug: 'software-logistico-retail-omnicanal',
    title: 'WMS para Retail y eCommerce Omnicanal — Fulfillment, Picking, Despacho | invasWMS',
    description: 'Software WMS para operaciones retail omnicanal. Fulfillment e-commerce, picking por olas, gestión multi-bodega, integración con marketplaces. +400% capacidad de despacho.',
    keyword: 'WMS para retail omnicanal',
  },
  {
    id: 3600, slug: 'software-logistico-para-3pl-y-4pl',
    title: 'WMS para Operadores Logísticos 3PL y 4PL — Multi-cliente, Multi-bodega | invasWMS',
    description: 'Sistema WMS diseñado para operadores logísticos 3PL/4PL. Gestión multi-cliente, multi-bodega, facturación por actividad, SLA por cliente. Escalable y seguro.',
    keyword: 'WMS para 3PL',
  },
  {
    id: 3604, slug: 'software-logistico-para-salud',
    title: 'WMS para Salud — Gestión de Insumos Médicos y Farmacéuticos | invasWMS',
    description: 'Software WMS para distribución de insumos médicos y farmacéuticos. Trazabilidad lote a lote, control de vencimientos, cumplimiento regulatorio, cadena de frío.',
    keyword: 'WMS para salud',
  },
  {
    id: 3602, slug: 'software-logistico-para-tecnologia',
    title: 'WMS para Tecnología — Gestión de Inventario de Equipos y Componentes | invasWMS',
    description: 'Sistema WMS para empresas de tecnología. Control de números de serie, gestión de garantías, logística inversa, integración con ERPs tecnológicos.',
    keyword: 'WMS para tecnología',
  },
  {
    id: 3608, slug: 'software-de-gestion-de-repuestos',
    title: 'WMS para Repuestos y Accesorios — Control de Piezas y Partes | invasWMS',
    description: 'Software WMS especializado en gestión de repuestos, piezas y accesorios. Control por número de parte, ubicación automática, reposición inteligente.',
    keyword: 'WMS para repuestos',
  },
  {
    id: 1796, slug: 'blog',
    title: 'Blog invasWMS — Tendencias, Casos de Éxito y Guías de Gestión de Almacenes',
    description: 'Artículos sobre WMS, logística, cadena de frío, automatización de bodegas, casos de éxito y tendencias en gestión de almacenes para Latinoamérica.',
    keyword: 'blog WMS logística',
  },
  {
    id: 1784, slug: 'contacto-invas',
    title: 'Contacto — Solicita una Demo de invasWMS | Chile, Colombia, México, USA',
    description: 'Agenda una demo personalizada de invasWMS. Oficinas en Santiago, Bogotá, Ciudad de México y Miami. Implementación en menos de 30 días.',
    keyword: 'demo WMS',
  },
  {
    id: 1803, slug: 'soporte-invaswms',
    title: 'Soporte Técnico — invasWMS | Ayuda y Atención al Cliente',
    description: 'Centro de soporte técnico de invasWMS. Atención al cliente, tickets de soporte, base de conocimiento, actualizaciones del sistema.',
    keyword: 'soporte invasWMS',
  },
]

var PAGES_EN = [
  {
    id: 4898, slug: 'home',
    title: 'invasWMS — Warehouse Management System for Distribution Centers | Americas',
    description: 'Cloud-based WMS software. 700+ connected sites across the Americas. Inventory control, picking, dispatch and traceability. Request a demo.',
    keyword: 'warehouse management system',
  },
  {
    id: 4990, slug: 'wms',
    title: 'WMS System — Cloud Warehouse Management Software | invasWMS',
    description: 'invasWMS is a cloud warehouse management system (WMS) that optimizes picking, inventory, receiving and dispatch. Implementation in under 30 days. 1,800+ connected users.',
    keyword: 'WMS system',
  },
  {
    id: 5012, slug: 'invasmonitor',
    title: 'invasMONITOR — Real-Time Logistics Monitoring | invasWMS',
    description: 'Monitor your warehouse and distribution operations in real time. Productivity KPIs, picking times, service levels. Dashboards connected to your WMS.',
    keyword: 'logistics monitoring',
  },
  {
    id: 5022, slug: 'invasdatalake',
    title: 'invasDATALAKE — Logistics Data Platform | invasWMS',
    description: 'Centralize your logistics operation data in an integrated platform. Advanced analytics, automated reports, ERP integrations.',
    keyword: 'logistics data platform',
  },
  {
    id: 5123, slug: 'about-us',
    title: 'About Us — invasWMS | Logistics Software Company in Latin America',
    description: 'invasWMS is a logistics software company headquartered in Chile, Colombia, Mexico and USA. 700+ sites, 250,000+ lines dispatched, 1,800+ users.',
    keyword: 'logistics software company',
  },
  {
    id: 5063, slug: 'industries',
    title: 'WMS by Industry — Food, Retail, 3PL, Healthcare, Technology | invasWMS',
    description: 'Specialized WMS solutions by industry: food & cold chain, omnichannel retail, 3PL/4PL logistics operators, healthcare, technology and spare parts.',
    keyword: 'WMS by industry',
  },
  {
    id: 5108, slug: 'food',
    title: 'WMS for Food & Cold Chain — Lot Control, FIFO, Traceability | invasWMS',
    description: 'Specialized WMS for food distribution. Expiration control, automatic FIFO, full traceability, regulatory compliance. Case: -60% picking time reduction.',
    keyword: 'WMS for food',
  },
  {
    id: 5075, slug: 'retail-ecommerce-omnichannel',
    title: 'WMS for Retail & eCommerce — Omnichannel Fulfillment | invasWMS',
    description: 'WMS software for omnichannel retail operations. eCommerce fulfillment, wave picking, multi-warehouse management, marketplace integration. +400% dispatch capacity.',
    keyword: 'WMS for retail',
  },
  {
    id: 5084, slug: 'logistics-operators-3pl-4pl',
    title: 'WMS for 3PL & 4PL Logistics Operators — Multi-client, Multi-warehouse | invasWMS',
    description: 'WMS designed for 3PL/4PL logistics operators. Multi-client, multi-warehouse management, activity-based billing, per-client SLA. Scalable and secure.',
    keyword: 'WMS for 3PL',
  },
  {
    id: 5102, slug: 'health',
    title: 'WMS for Healthcare — Medical & Pharmaceutical Supply Management | invasWMS',
    description: 'WMS software for medical and pharmaceutical distribution. Lot-by-lot traceability, expiration control, regulatory compliance, cold chain.',
    keyword: 'WMS for healthcare',
  },
  {
    id: 5093, slug: 'technology',
    title: 'WMS for Technology — Equipment & Components Inventory | invasWMS',
    description: 'WMS for technology companies. Serial number tracking, warranty management, reverse logistics, tech ERP integration.',
    keyword: 'WMS for technology',
  },
  {
    id: 5114, slug: 'equipment-spare-parts-accessories',
    title: 'WMS for Spare Parts & Accessories — Parts Control | invasWMS',
    description: 'Specialized WMS for spare parts, pieces and accessories management. Part number control, automatic location, intelligent replenishment.',
    keyword: 'WMS for spare parts',
  },
  {
    id: 5129, slug: 'blog-en',
    title: 'invasWMS Blog — Trends, Case Studies & Warehouse Management Guides',
    description: 'Articles about WMS, logistics, cold chain, warehouse automation, success stories and trends in warehouse management for Latin America.',
    keyword: 'WMS blog',
  },
  {
    id: 5183, slug: 'contact',
    title: 'Contact — Request an invasWMS Demo | Chile, Colombia, Mexico, USA',
    description: 'Schedule a personalized invasWMS demo. Offices in Santiago, Bogota, Mexico City and Miami. Implementation in under 30 days.',
    keyword: 'WMS demo',
  },
]

var ALL_PAGES = PAGES_ES.concat(PAGES_EN)

async function updateRankMathMeta(pageId, objectType, title, description, keyword) {
  // RankMath updateMeta endpoint
  var res = await fetch(WP_URL + '/wp-json/rankmath/v1/updateMeta', {
    method: 'POST',
    headers: {
      'Authorization': AUTH,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      objectID: pageId,
      objectType: objectType || 'post',
      meta: {
        rank_math_title: title,
        rank_math_description: description,
        rank_math_focus_keyword: keyword,
        rank_math_robots: ['index', 'follow'],
      }
    })
  })
  return res.ok
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  INVAS WMS — ACTUALIZACIÓN SEO (34 páginas)')
  console.log('═══════════════════════════════════════════\n')

  var ok = 0
  var fail = 0

  for (var i = 0; i < ALL_PAGES.length; i++) {
    var p = ALL_PAGES[i]
    try {
      var success = await updateRankMathMeta(p.id, 'post', p.title, p.description, p.keyword)
      if (success) {
        ok++
        console.log('  ✅ ' + p.id + ' | ' + p.slug + ' | ' + p.keyword)
      } else {
        // Intentar como page type
        success = await updateRankMathMeta(p.id, 'page', p.title, p.description, p.keyword)
        if (success) {
          ok++
          console.log('  ✅ ' + p.id + ' | ' + p.slug + ' | ' + p.keyword)
        } else {
          fail++
          console.log('  ❌ ' + p.id + ' | ' + p.slug + ' — no se pudo actualizar')
        }
      }
    } catch (e) {
      fail++
      console.log('  ❌ ' + p.id + ' | ' + p.slug + ' — error: ' + e.message)
    }
  }

  console.log('\n═══════════════════════════════════════════')
  console.log('  RESULTADO: ' + ok + ' actualizadas, ' + fail + ' fallidas')
  console.log('═══════════════════════════════════════════')
}

main().catch(function(e) { console.error('Error:', e.message); process.exit(1) })
