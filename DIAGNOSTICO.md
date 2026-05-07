# invasWMS — Diagnóstico SEO + Problemas de Campañas

## Por qué las campañas no convierten

### Problemas encontrados (7 mayo 2026)

| Problema | Impacto en campañas | Estado |
|----------|-------------------|--------|
| **TTFB 1.1 segundos** | Usuarios se van antes de que cargue. Google penaliza en Quality Score. | LiteSpeed Cache activado — medir en 24h |
| **Home pesa 999KB** | Tiempo de carga alto = tasa de rebote alta = campañas caras | Pendiente optimización de imágenes |
| **Solo 1 landing page** | Toda la pauta llega a /contacto/ genérico. No hay landing por industria. | Crear landings: /demo-alimentos, /demo-3pl, /demo-retail |
| **0 meta descriptions (antes)** | CTR orgánico bajo → menos tráfico → más dependencia de pauta | ✅ RESUELTO: 29 páginas con meta |
| **0 schemas (antes)** | Sin rich snippets → menor visibilidad en Google | ✅ RESUELTO: 6 tipos de schema |
| **14 posts en blog (antes)** | Sin contenido indexable → no aparece en búsquedas informacionales | ✅ RESUELTO: 25+ posts ahora, blog diario activo |
| **Sin rankings/comparativas** | No aparece cuando buscan "mejor WMS" | ✅ RESUELTO: 5 rankings publicados |
| **Yoast + RankMath** | Conflicto de plugins SEO | Yoast desactivado, pendiente borrar |

### Lo que se resolvió hoy

1. **29 meta descriptions** optimizadas por keyword (ES + EN)
2. **6 schemas JSON-LD**: Organization, WebSite, SoftwareApplication, FAQPage, AI Search, BreadcrumbList
3. **11 artículos nuevos**: 5 rankings por industria + 1 blog diario + 5 blogs WMS keywords
4. **Blog automatizado**: corre L-V a las 7 AM Chile
5. **LiteSpeed Cache activado**: debería bajar TTFB de 1.1s a <0.5s
6. **IndexNow enviado**: Bing/Yandex van a indexar en horas
7. **Emails a Jaime**: jvio@impruvex.com recibe notificación por cada post

### Lo que falta (crítico para campañas)

1. **Landing pages por industria** — crear /demo-alimentos/, /demo-3pl/, /demo-retail/ con formulario específico
2. **PageSpeed optimization** — comprimir imágenes, lazy load, minimizar CSS/JS
3. **Core Web Vitals** — medir LCP, FID, CLS después de activar LiteSpeed
4. **Google Ads landing page experience** — el Quality Score depende de velocidad + relevancia
5. **19 errores 404** del reporte RankMath — crear redirects
6. **H1 del home** — no tiene, afecta SEO on-page

### Métricas a monitorear

| Métrica | Antes (7 mayo) | Meta 30 días | Meta 90 días |
|---------|----------------|-------------|-------------|
| Posts blog | 14 | 40+ | 80+ |
| Keywords posicionando | 51 | 100+ | 200+ |
| Posición media | 23 | <18 | <12 |
| Impresiones/mes | 790 | 2.000+ | 5.000+ |
| Clicks/mes | 51 | 150+ | 300+ |
| TTFB | 1.1s | <0.5s | <0.3s |
| Schemas | 0 | 6 tipos | 8 tipos |

## Acceso

- WordPress API: Application Password en GitHub Secrets
- RankMath SEO: activo y configurado
- Site Kit (Google): conectado
- LiteSpeed Cache: recién activado
- Polylang Pro: ES/EN con hreflang OK

## Contactos

- Cliente: jvio@impruvex.com (Jaime)
- Agencia: contacto@mulleryperez.cl (Christopher)
