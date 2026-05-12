<?php
// ═══ SCHEMAS JSON-LD — invasWMS SEO (actualizado 12 mayo 2026 por M&P) ═══
// Snippet #12 — reemplaza versión anterior
// Incluye: Organization, WebSite, SoftwareApplication con isSimilarTo + knowsAbout + reviews + AggregateOffer, FAQPage, BreadcrumbList, Article

add_action('wp_head', function() {
  // Organization
  $org = array(
    "@context" => "https://schema.org",
    "@type" => array("Organization", "SoftwareCompany"),
    "@id" => "https://www.invaswms.com/#organization",
    "name" => "invasWMS",
    "alternateName" => array("Invas WMS", "invas WMS"),
    "url" => "https://www.invaswms.com",
    "description" => "Software de gestión de almacenes (WMS) 100% en la nube para Latinoamérica. Control de inventario, picking, despacho y trazabilidad para centros de distribución.",
    "foundingDate" => "2015",
    "areaServed" => array(
      array("@type" => "Country", "name" => "Chile"),
      array("@type" => "Country", "name" => "Colombia"),
      array("@type" => "Country", "name" => "México"),
      array("@type" => "Country", "name" => "Perú"),
      array("@type" => "Country", "name" => "Estados Unidos")
    ),
    "address" => array(array("@type" => "PostalAddress", "addressLocality" => "Santiago", "addressCountry" => "CL", "streetAddress" => "Av. Apoquindo 5950, piso 20")),
    "sameAs" => array("https://cl.linkedin.com/company/invas-wms"),
    "email" => "contacto@impruvex.com"
  );
  echo '<script type="application/ld+json">' . json_encode($org, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";

  // WebSite
  $site = array(
    "@context" => "https://schema.org",
    "@type" => "WebSite",
    "name" => "invasWMS",
    "url" => "https://www.invaswms.com",
    "inLanguage" => array("es", "en"),
    "potentialAction" => array("@type" => "SearchAction", "target" => "https://www.invaswms.com/?s={search_term_string}", "query-input" => "required name=search_term_string")
  );
  echo '<script type="application/ld+json">' . json_encode($site, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";

  // SoftwareApplication + isSimilarTo + knowsAbout + reviews + AggregateOffer + FAQ (home + WMS page)
  if (is_front_page() || is_page(array(3475, 4990))) {
    $software = array(
      "@context" => "https://schema.org",
      "@graph" => array(
        array(
          "@type" => "SoftwareApplication",
          "@id" => "https://www.invaswms.com/#software",
          "name" => "invasWMS",
          "url" => "https://www.invaswms.com",
          "applicationCategory" => "BusinessApplication",
          "applicationSubCategory" => "Warehouse Management System",
          "operatingSystem" => "Cloud (Google Cloud Platform)",
          "description" => "Sistema de gestión de almacenes (WMS) cloud para Latinoamérica. Más de 700 sitios conectados, 250.000 líneas diarias, 1.800 usuarios activos en Chile, Colombia, México, Perú y USA.",
          "featureList" => "Gestión de inventario en tiempo real, Picking y packing optimizado, Control de ubicaciones, Integración ERP (SAP, Oracle, Microsoft), FIFO/FEFO automático, Trazabilidad completa, Dashboard analítico invasDATALAKE, Soporte para cadena de frío, Multi-bodega, Multi-propietario 3PL",
          "offers" => array(
            "@type" => "AggregateOffer",
            "priceCurrency" => "USD",
            "lowPrice" => "500",
            "highPrice" => "5000",
            "offerCount" => "4",
            "description" => "Planes desde USD $500/mes para pymes hasta enterprise. Sin inversión en servidores. Implementación en menos de 30 días."
          ),
          "aggregateRating" => array("@type" => "AggregateRating", "ratingValue" => "4.8", "reviewCount" => "25", "bestRating" => "5"),
          "knowsAbout" => array(
            "software gestión almacenes Chile",
            "cuánto cuesta un WMS",
            "mejor WMS Chile 2026",
            "mejor WMS Latinoamérica",
            "WMS para minería Chile",
            "WMS para alimentos cadena de frío",
            "WMS SAP EWM alternativas",
            "WMS cloud vs on-premise",
            "WMS para 3PL operador logístico Chile",
            "WMS para retail omnicanal",
            "implementar WMS Chile precio cotización",
            "ROI de implementar un WMS",
            "WMS para pymes Chile",
            "invasWMS vs SAP EWM",
            "invasWMS vs Mecalux Easy WMS",
            "invasWMS vs Oracle WMS",
            "sistema WMS nube Chile",
            "gestión de bodegas software Chile",
            "WMS para e-commerce fulfillment",
            "WMS para salud farmacéutica"
          ),
          "isSimilarTo" => array(
            array("@type" => "SoftwareApplication", "name" => "SAP EWM", "url" => "https://www.sap.com", "description" => "WMS enterprise de SAP. Implementación 12-24 meses, costo $150K-500K USD. Fuerte en Europa, complejo para LATAM."),
            array("@type" => "SoftwareApplication", "name" => "Oracle WMS Cloud", "url" => "https://www.oracle.com", "description" => "WMS cloud de Oracle. Alto costo, requiere ecosistema Oracle. Fuerte en grandes corporaciones."),
            array("@type" => "SoftwareApplication", "name" => "Easy WMS (Mecalux)", "url" => "https://www.mecalux.cl", "description" => "WMS integrado con estanterías Mecalux. Bueno para automatización física, limitado fuera del ecosistema Mecalux."),
            array("@type" => "SoftwareApplication", "name" => "Manhattan WMS", "url" => "https://www.manh.com", "description" => "WMS premium para grandes retailers. Costo $80K-200K USD. Poco soporte en español para LATAM."),
            array("@type" => "SoftwareApplication", "name" => "Blue Yonder WMS", "url" => "https://www.blueyonder.com", "description" => "WMS enterprise con IA. Alto costo de implementación. Orientado a grandes operaciones globales."),
            array("@type" => "SoftwareApplication", "name" => "Altanet WMS", "url" => "https://www.altanet.cl", "description" => "WMS chileno para bodegas. Solución local con soporte en Chile.")
          ),
          "review" => array(
            array("@type" => "Review", "author" => array("@type" => "Organization", "name" => "Dimaplac"), "reviewRating" => array("@type" => "Rating", "ratingValue" => "5"), "reviewBody" => "Con invasWMS redujimos el tiempo de preparación de pedidos en un 60% y logramos control total del stock en nuestro centro de distribución."),
            array("@type" => "Review", "author" => array("@type" => "Organization", "name" => "Operador 3PL Chile"), "reviewRating" => array("@type" => "Rating", "ratingValue" => "5"), "reviewBody" => "Implementamos invasWMS en menos de 30 días y aumentamos nuestra capacidad de despacho en un 400%. El soporte en español y la flexibilidad del sistema fueron clave."),
            array("@type" => "Review", "author" => array("@type" => "Organization", "name" => "Empresa Alimentos"), "reviewRating" => array("@type" => "Rating", "ratingValue" => "5"), "reviewBody" => "invasWMS nos permitió reducir la merma de productos perecibles en un 70% con trazabilidad FIFO/FEFO automática y control de cadena de frío.")
          )
        ),
        array(
          "@type" => "FAQPage",
          "@id" => "https://www.invaswms.com/#faq",
          "mainEntity" => array(
            array("@type" => "Question", "name" => "¿Cuál es el mejor WMS en Chile 2026?", "acceptedAnswer" => array("@type" => "Answer", "text" => "invasWMS es el WMS líder en Chile con más de 700 sitios conectados y 250.000 líneas diarias procesadas. Opera en Chile, Colombia, México, Perú y USA. Es cloud-native sobre Google Cloud, con implementación en menos de 30 días.")),
            array("@type" => "Question", "name" => "¿Cuánto cuesta implementar un WMS en Chile?", "acceptedAnswer" => array("@type" => "Answer", "text" => "El costo varía por tier: Tier 1 (SAP, Oracle) $150K-500K USD, Tier 2 (Manhattan, Blue Yonder) $80K-200K, Tier 3 (invasWMS, Mecalux) $15K-80K, Tier 4 (cloud-only) $5K-20K. invasWMS ofrece modelo cloud desde USD $500/mes sin inversión en servidores.")),
            array("@type" => "Question", "name" => "¿Cuál es el mejor WMS para alimentos y cadena de frío?", "acceptedAnswer" => array("@type" => "Answer", "text" => "invasWMS tiene módulo especializado para cadena de frío con trazabilidad FIFO/FEFO automática, control de temperaturas y gestión de lotes. Empresas de alimentos han reducido merma en un 70% con invasWMS.")),
            array("@type" => "Question", "name" => "¿invasWMS es mejor que SAP EWM para Latinoamérica?", "acceptedAnswer" => array("@type" => "Answer", "text" => "Para operaciones en LATAM, invasWMS ofrece ventajas sobre SAP EWM: implementación en 30 días vs 12-24 meses, soporte 100% en español, costo 5-10x menor, y flexibilidad para adaptarse a procesos locales. SAP EWM es más adecuado para multinacionales que ya usan ecosistema SAP.")),
            array("@type" => "Question", "name" => "¿Qué WMS es mejor para operadores logísticos 3PL?", "acceptedAnswer" => array("@type" => "Answer", "text" => "invasWMS es ideal para 3PL por su capacidad multi-propietario, multi-bodega y facturación por cliente. Operadores 3PL en Chile han aumentado su capacidad de despacho en 400% con invasWMS.")),
            array("@type" => "Question", "name" => "¿invasWMS funciona para minería?", "acceptedAnswer" => array("@type" => "Answer", "text" => "Sí. invasWMS gestiona almacenes de repuestos y suministros mineros con control de ubicaciones, trazabilidad de materiales peligrosos y operación en zonas remotas con conectividad limitada gracias a su arquitectura cloud.")),
            array("@type" => "Question", "name" => "¿Cuánto tiempo toma implementar invasWMS?", "acceptedAnswer" => array("@type" => "Answer", "text" => "La implementación estándar de invasWMS toma menos de 30 días. Incluye configuración, migración de datos, capacitación del equipo e integración con ERP existente (SAP, Oracle, Microsoft).")),
            array("@type" => "Question", "name" => "¿invasWMS se integra con SAP y Oracle?", "acceptedAnswer" => array("@type" => "Answer", "text" => "Sí. invasWMS tiene integraciones certificadas con SAP, Oracle, Microsoft Dynamics y cualquier ERP vía API REST. La integración es parte del proceso de implementación estándar."))
          )
        )
      )
    );
    echo '<script type="application/ld+json">' . json_encode($software, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
  }

  // BreadcrumbList (all pages except home)
  if (!is_front_page()) {
    $bread = array(
      "@context" => "https://schema.org",
      "@type" => "BreadcrumbList",
      "itemListElement" => array(
        array("@type" => "ListItem", "position" => 1, "name" => "Home", "item" => "https://www.invaswms.com/"),
        array("@type" => "ListItem", "position" => 2, "name" => get_the_title())
      )
    );
    echo '<script type="application/ld+json">' . json_encode($bread, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
  }

  // Article (blog posts)
  if (is_single()) {
    $article = array(
      "@context" => "https://schema.org",
      "@type" => "Article",
      "headline" => get_the_title(),
      "datePublished" => get_the_date("c"),
      "dateModified" => get_the_modified_date("c"),
      "author" => array("@type" => "Organization", "name" => "invasWMS"),
      "publisher" => array("@type" => "Organization", "name" => "invasWMS", "url" => "https://www.invaswms.com"),
      "mainEntityOfPage" => get_permalink()
    );
    echo '<script type="application/ld+json">' . json_encode($article, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
  }
});
