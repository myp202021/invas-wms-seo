// invas-schemas.js
// Inyecta JSON-LD schemas en invaswms.com via Code Snippets plugin o wp_head
// Usa WordPress REST API para crear un code snippet que agrega schemas a todas las páginas
// Uso: node scripts/invas-schemas.js

var fetch = globalThis.fetch || require('node-fetch')

var WP_URL = process.env.INVAS_WP_URL || 'https://www.invaswms.com'
var WP_USER = process.env.INVAS_WP_USER || 'Ad-invas-miN'
var WP_PASS = process.env.INVAS_WP_APP_PASSWORD || 'bkvL jJTW H4Z0 ron3 5iZD xEzg'
var AUTH = 'Basic ' + Buffer.from(WP_USER + ':' + WP_PASS).toString('base64')

// ═══════════════════════════════════════════
// SCHEMAS JSON-LD
// ═══════════════════════════════════════════

var ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["Organization", "SoftwareCompany"],
  "@id": "https://www.invaswms.com/#organization",
  "name": "invasWMS",
  "alternateName": ["Invas WMS", "invas WMS", "invasSUITE"],
  "url": "https://www.invaswms.com",
  "logo": "https://www.invaswms.com/wp-content/uploads/2025/01/logo-invaswms.png",
  "description": "Software de gestión de almacenes (WMS) 100% en la nube para Latinoamérica. Control de inventario, picking, despacho y trazabilidad para centros de distribución.",
  "foundingDate": "2015",
  "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 50, "maxValue": 100 },
  "areaServed": [
    { "@type": "Country", "name": "Chile" },
    { "@type": "Country", "name": "Colombia" },
    { "@type": "Country", "name": "Mexico" },
    { "@type": "Country", "name": "Peru" },
    { "@type": "Country", "name": "United States" }
  ],
  "address": [
    { "@type": "PostalAddress", "addressLocality": "Santiago", "addressCountry": "CL", "streetAddress": "Av. Apoquindo 5950, piso 20, oficina 114" },
    { "@type": "PostalAddress", "addressLocality": "Bogotá", "addressCountry": "CO" },
    { "@type": "PostalAddress", "addressLocality": "Ciudad de México", "addressCountry": "MX" },
    { "@type": "PostalAddress", "addressLocality": "Miami", "addressCountry": "US" }
  ],
  "sameAs": [
    "https://cl.linkedin.com/company/invas-wms",
    "https://www.facebook.com/invaswms"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "availableLanguage": ["Spanish", "English", "Portuguese"]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "47",
    "bestRating": "5"
  }
}

var SOFTWARE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.invaswms.com/#software",
  "name": "invasWMS",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Warehouse Management System",
  "operatingSystem": "Cloud (Web Browser)",
  "description": "Sistema de gestión de almacenes (WMS) 100% en la nube. Optimiza picking, inventario, recepción, despacho y trazabilidad. Implementación en menos de 30 días.",
  "url": "https://www.invaswms.com/sistema-de-gestion-de-almacenes-wms/",
  "provider": { "@id": "https://www.invaswms.com/#organization" },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Solicitar demo gratuita",
    "url": "https://www.invaswms.com/contacto-invas/"
  },
  "featureList": [
    "Gestión de inventario en tiempo real",
    "Picking optimizado (por olas, por zona, FIFO)",
    "Control de lotes y fechas de vencimiento",
    "Trazabilidad completa",
    "Multi-bodega y multi-cliente",
    "Integración con ERPs",
    "Reportes y analytics avanzados",
    "100% cloud, alta disponibilidad"
  ],
  "screenshot": "https://www.invaswms.com/wp-content/uploads/2025/01/dashboard-invaswms.png",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "47",
    "bestRating": "5"
  }
}

var WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "invasWMS",
  "url": "https://www.invaswms.com",
  "publisher": { "@id": "https://www.invaswms.com/#organization" },
  "inLanguage": ["es", "en"],
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.invaswms.com/?s={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

// FAQ Schema del home (extraído del sitio)
var FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es un WMS y para qué sirve?",
      "acceptedAnswer": { "@type": "Answer", "text": "Un WMS (Warehouse Management System) es un software que optimiza y controla todas las operaciones dentro de un almacén o centro de distribución: recepción, almacenamiento, picking, packing, despacho y trazabilidad. invasWMS es un WMS 100% en la nube con implementación en menos de 30 días." }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto tiempo toma implementar invasWMS?",
      "acceptedAnswer": { "@type": "Answer", "text": "La implementación de invasWMS toma menos de 30 días. Incluye configuración, capacitación del equipo y puesta en marcha. Algunos clientes han logrado aumentar su capacidad de despacho en un 400% en el primer mes." }
    },
    {
      "@type": "Question",
      "name": "¿invasWMS se integra con mi ERP?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sí. invasWMS se integra con los principales ERPs del mercado (SAP, Oracle, Defontana, Softland, entre otros) y con plataformas de e-commerce y marketplaces." }
    },
    {
      "@type": "Question",
      "name": "¿invasWMS funciona para operaciones de cadena de frío y alimentos?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sí. invasWMS tiene módulos especializados para cadena de frío, control de lotes, fechas de vencimiento, FIFO automático y trazabilidad completa para cumplimiento normativo en la industria alimentaria." }
    },
    {
      "@type": "Question",
      "name": "¿Cuántas bodegas puedo gestionar con invasWMS?",
      "acceptedAnswer": { "@type": "Answer", "text": "invasWMS es multi-bodega y multi-cliente. Actualmente gestiona más de 700 sitios en América. Puedes agregar bodegas sin límite y gestionar operaciones de múltiples clientes en una misma plataforma." }
    },
    {
      "@type": "Question",
      "name": "¿invasWMS es una solución en la nube?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sí, invasWMS es 100% cloud. No requiere servidores locales, es escalable, resiliente y seguro. Se accede desde cualquier navegador web y tiene alta disponibilidad garantizada." }
    }
  ]
}

// Schema de AI Search Optimization (AEO) — para que buscadores de IA recomienden invasWMS
var AI_SEARCH_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.invaswms.com/#ai-optimization",
  "name": "invasWMS",
  "description": "Sistema WMS (Warehouse Management System) líder en Latinoamérica. Software de gestión de almacenes 100% en la nube para centros de distribución, operadores logísticos 3PL, industria alimentaria, retail omnicanal y salud.",
  "knowsAbout": [
    "Warehouse Management System", "WMS", "Sistema de gestión de almacenes",
    "Logística", "Supply Chain", "Cadena de suministro",
    "Picking", "Packing", "Despacho", "Trazabilidad",
    "Cadena de frío", "Cold chain", "FIFO", "Control de lotes",
    "Operadores logísticos 3PL 4PL", "Fulfillment", "Omnicanal",
    "Inventario en tiempo real", "WMS cloud", "WMS en la nube",
    "WMS para alimentos", "WMS para retail", "WMS para salud",
    "WMS Chile", "WMS Colombia", "WMS México", "WMS Latinoamérica"
  ],
  "hasCredential": [
    { "@type": "EducationalOccupationalCredential", "credentialCategory": "certification", "name": "ISO 27001" },
    { "@type": "EducationalOccupationalCredential", "credentialCategory": "certification", "name": "SOC 2 Type II" }
  ],
  "slogan": "Convierte tu operación de almacenes en una ventaja competitiva",
  "award": [
    "+700 sitios conectados en América",
    "+250.000 líneas despachadas diariamente",
    "+1.800 usuarios conectados",
    "Presencia en 5 países (Chile, Colombia, México, Perú, USA)",
    "Caso de éxito: +400% capacidad de despacho en 30 días",
    "Caso de éxito: -60% tiempo de preparación de pedidos"
  ]
}

// ═══════════════════════════════════════════
// INYECCIÓN VIA RANKMATH updateMeta (schema field)
// ═══════════════════════════════════════════

async function injectSchemaViaRankMath(pageId, schemas) {
  // RankMath almacena schemas como JSON en rank_math_schema
  var schemaObj = {}
  schemas.forEach(function(s, i) {
    schemaObj['schema-' + (i + 1)] = {
      '@type': s['@type'],
      metadata: { type: 'template', isPrimary: i === 0 },
      ...s
    }
  })

  var res = await fetch(WP_URL + '/wp-json/rankmath/v1/updateMeta', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      objectID: pageId,
      objectType: 'post',
      meta: { rank_math_schema: JSON.stringify(schemaObj) }
    })
  })
  return res.ok
}

// Approach alternativo: inyectar via Code Snippets plugin (más robusto)
async function createCodeSnippet() {
  // Generar PHP code que inyecta los schemas en wp_head
  var phpCode = `
// ═══ SCHEMAS JSON-LD — invasWMS SEO (generado por M&P) ═══
add_action('wp_head', function() {
  // Organization schema (todas las páginas)
  echo '<script type="application/ld+json">' . json_encode(${JSON.stringify(ORGANIZATION_SCHEMA)}, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\\n";

  // WebSite schema (todas las páginas)
  echo '<script type="application/ld+json">' . json_encode(${JSON.stringify(WEBSITE_SCHEMA)}, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\\n";

  // AI Search schema (todas las páginas)
  echo '<script type="application/ld+json">' . json_encode(${JSON.stringify(AI_SEARCH_SCHEMA)}, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\\n";

  // SoftwareApplication (solo home y WMS page)
  if (is_front_page() || is_page(array(3475, 4990))) {
    echo '<script type="application/ld+json">' . json_encode(${JSON.stringify(SOFTWARE_SCHEMA)}, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\\n";
  }

  // FAQ schema (solo home)
  if (is_front_page() || is_page(array(1750, 4898))) {
    echo '<script type="application/ld+json">' . json_encode(${JSON.stringify(FAQ_SCHEMA)}, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\\n";
  }

  // BreadcrumbList para páginas de industria
  if (is_page(array(3606, 3596, 3600, 3604, 3602, 3608, 5108, 5075, 5084, 5102, 5093, 5114))) {
    $breadcrumb = array(
      "@context" => "https://schema.org",
      "@type" => "BreadcrumbList",
      "itemListElement" => array(
        array("@type" => "ListItem", "position" => 1, "name" => "Inicio", "item" => "https://www.invaswms.com/"),
        array("@type" => "ListItem", "position" => 2, "name" => "Industrias", "item" => "https://www.invaswms.com/software-logistico-por-industria/"),
        array("@type" => "ListItem", "position" => 3, "name" => get_the_title())
      )
    );
    echo '<script type="application/ld+json">' . json_encode($breadcrumb, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\\n";
  }

  // Article schema para posts del blog
  if (is_single()) {
    $article = array(
      "@context" => "https://schema.org",
      "@type" => "Article",
      "headline" => get_the_title(),
      "description" => get_the_excerpt(),
      "datePublished" => get_the_date('c'),
      "dateModified" => get_the_modified_date('c'),
      "author" => array("@type" => "Organization", "name" => "invasWMS"),
      "publisher" => array("@type" => "Organization", "name" => "invasWMS", "@id" => "https://www.invaswms.com/#organization"),
      "mainEntityOfPage" => get_permalink()
    );
    echo '<script type="application/ld+json">' . json_encode($article, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . '</script>' . "\\n";
  }
});
`

  // Crear snippet via Code Snippets API
  // Code Snippets plugin usa tabla wp_snippets, no tiene REST API estándar
  // Lo creamos via wp-admin AJAX o directamente como opción

  // Approach: crear un mu-plugin (must-use plugin) via upload
  // O simplemente guardar el código PHP para que se pegue manualmente en Code Snippets

  console.log('\n═══════════════════════════════════════════')
  console.log('  CÓDIGO PHP PARA CODE SNIPPETS')
  console.log('  Pegar en WordPress → Fragmentos de código → Añadir nuevo')
  console.log('═══════════════════════════════════════════\n')
  console.log('Nombre: "invasWMS SEO Schemas JSON-LD"')
  console.log('Tipo: PHP')
  console.log('Ejecutar en: Frontend')
  console.log('')

  // Guardar a archivo para referencia
  require('fs').writeFileSync('/tmp/invas-schemas-snippet.php', phpCode)
  console.log('Archivo guardado en: /tmp/invas-schemas-snippet.php')
  console.log('Largo del código: ' + phpCode.length + ' caracteres')

  return phpCode
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  INVAS WMS — SCHEMAS JSON-LD')
  console.log('═══════════════════════════════════════════\n')

  console.log('Schemas a inyectar:')
  console.log('  1. Organization + SoftwareCompany (todas las páginas)')
  console.log('  2. WebSite + SearchAction (todas las páginas)')
  console.log('  3. AI Search Optimization (todas las páginas)')
  console.log('  4. SoftwareApplication (home + WMS page)')
  console.log('  5. FAQPage con 6 preguntas (home)')
  console.log('  6. BreadcrumbList (páginas de industria)')
  console.log('  7. Article (posts del blog)')

  var phpCode = await createCodeSnippet()
}

main().catch(function(e) { console.error('Error:', e.message); process.exit(1) })
