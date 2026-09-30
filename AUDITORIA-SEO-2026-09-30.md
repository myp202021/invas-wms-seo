# Auditoría SEO — invasWMS (invaswms.com)
**Fecha:** 30 septiembre 2026 · **Anterior:** 12 agosto 2026
**Método:** rastreo en vivo (home + 30 URLs del sitemap + 177 posts vía API WordPress), PageSpeed Insights móvil, visibilidad Google + ChatGPT semana 21 sept (15 búsquedas).
**Datos crudos:** `myp-daily-agent/data/auditorias/invas-2026-09-30.json`

## Resumen
La base técnica es buena:
- title y meta description correctos;
- schema en todas las páginas revisadas;
- canonical coherente;
- llms.txt publicado;
- SEO 100/100 en PageSpeed.

El blog funciona en búsquedas de nicho: **#1 en Google** en "mejores herramientas de monitoreo logístico", "wms para pymes vs enterprise" y "costos logísticos en latinoamérica", y #4 en "reducir mermas en alimentos". En ChatGPT sale **#1 en "WMS Latinoamérica" y en "WMS costo beneficio Latinoamérica"**.

Hay tres problemas:
1. **177 posts con 36 temas repetidos.** Hay 4 versiones casi idénticas de "slotting", "robótica", "normativa sanitaria", "cross docking", "ROI WMS" e "implementar WMS en 30 días".
2. **9 títulos dicen "2023"**, aunque todos se publicaron en 2026.
3. **Invas no aparece en el top 10 de Google en las búsquedas comerciales**: "software WMS Chile", "mejor WMS Chile", "WMS para centros de distribución" y "wms 3pl". En agosto se había registrado #1–2 en "mejor WMS Chile". Esta medición (Apify, 21 sept) no lo encuentra. Hay que verificarlo a mano; si se confirma, es una caída.

## Hallazgos

### [ALTA] Canibalización: 36 temas duplicados (~110 posts)
| Tema | Versiones |
|---|---|
| Cadena de frío / alimentos (rankings y guías) | 6 |
| Retail omnicanal / fulfillment | 4 (+3 rankings omnicanal) |
| Slotting, robótica, normativa sanitaria, implementar WMS 30 días, cross docking, ROI WMS | 4 c/u |
| invasWMS vs SAP / Oracle | 4 |
| Errores implementación, mermas alimentos, monitoreo logístico, comparativa funcionalidades, sostenibilidad, tipos de WMS, vs Manhattan, last mile, WMS cloud Chile | 3 c/u |
| 17 temas más | 2 c/u |

Hay dos casos en que ambas versiones tienen menos de 400 palabras (por ejemplo, "Reducir costo por línea despachada", 332 y 386 palabras).

**Arreglo:**
- Dejar 1 URL por tema. Donde una ya rankea #1, conservar esa: /ranking-mejores-herramientas-monitoreo-logistico-2026/, /wms-pyme-enterprise-comparativa/, /costos-logisticos-latinoamerica/ y /reducir-mermas-alimentos/.
- Redirigir el resto con 301.
- Resultado esperado: de 177 posts quedan unos 90.

### [ALTA] Títulos con año 2023
Son 9 posts: WMS cloud Chile ×3, ranking omnicanal ×2, cadena de frío, 3PL LATAM y funcionalidades ×2.

En una búsqueda de 2026, un título con "2023" parece desactualizado y baja el CTR. **Arreglo:** cambiarlos a 2026 (o quitar el año) y agregar al prompt del agente la regla "solo año 2026".

### [ALTA] Búsquedas comerciales fuera del top 10
- Las 6 búsquedas de compra ("software WMS Chile", "mejor WMS Chile", "sistema de gestión de bodegas", "WMS para centros de distribución", "software de inventario para bodegas", "wms 3pl") no tienen a Invas en Google.
- En esas búsquedas aparecen Altanet, BodegApp, Devnia, INNVITA y PanalWMS.
- ChatGPT sí menciona a Invas en 5 de ellas (posiciones #6 a #10).

El blog trae tráfico informativo, pero las páginas comerciales (home, /software-wms/, landings por industria) no reciben enlaces internos desde los posts. **Arreglo:** en cada post, un enlace con anchor comercial ("software WMS", "sistema WMS para centros de distribución") hacia la página de servicio correspondiente.

### [MEDIA] Sitemap incompleto
El sitemap de posts lista 145 URLs, pero hay 177 posts publicados: **32 posts no están en el sitemap**. Hay que regenerar el sitemap en el plugin SEO o limpiar la caché.

### [MEDIA] Velocidad y servidor
| Página | Performance | LCP | TBT | Usuarios reales |
|---|---|---|---|---|
| Home | 40/100 | 4,2 s | **2.530 ms** | LCP promedio · CLS rápido |
| Blog EN | 65/100 | 3,3 s | 930 ms | LCP promedio |

- La home tardó **3,9 s** en responder desde el servidor, con x-cache MISS.
- El TBT de 2,5 s viene del JavaScript (Elementor y scripts de terceros).
- **Arreglo:** caché de página completa en nginx o con un plugin y "delay JS". No hay Cloudflare, así que una CDN gratuita también ayudaría.

### [MEDIA] Páginas duplicadas y delgadas
- `/solicitar-demo/` y `/solicitar-demo-2/` tienen el mismo title. Hay que dejar una y redirigir la otra.
- Hay landings de menos de 200 palabras: /empresa-de-software-logistico/ (197) y /software-logistico-por-industria/ (107). Son páginas comerciales que deberían tener 600 palabras o más.
- 34 posts tienen menos de 600 palabras.
- 173 de 177 posts no tienen imagen destacada, así que al compartir no hay og:image.
- 204 de 250 imágenes revisadas no tienen alt.

## Visibilidad (semana 21 sept)
| Búsqueda | Google | ChatGPT |
|---|---|---|
| mejores herramientas de monitoreo logístico | **#1** | — |
| wms para pymes vs enterprise | **#1** | #7 |
| costos logísticos en latinoamérica | **#1** | — |
| reducir mermas en alimentos | #4 | — |
| WMS Latinoamérica | — | **#1** |
| WMS costo beneficio Latinoamérica | — | **#1** |
| mejor WMS Chile | — (antes #1–2, verificar) | #6 |
| software de inventario para bodegas | — | #7 |
| checklist proveedores WMS | — | #8 |
| sistema de gestión de bodegas · wms retail omnicanal | — | #10 |
| software WMS Chile · WMS para CD · wms 3pl · tecnología mermas | — | — |

## Plan priorizado
1. **Consolidar los 36 temas duplicados** (301 y fusión), conservando las URLs que ya rankean.
2. **Corregir los 9 títulos con "2023"** y la regla de año en el agente.
3. **Enlazar desde los posts a las páginas comerciales** y ampliar las 2 landings delgadas.
4. Verificar a mano "mejor WMS Chile" en Google (incógnito, Chile).
5. Regenerar el sitemap (faltan 32 posts).
6. Optimizar velocidad: caché del servidor y delay JS.
7. Unificar /solicitar-demo/ y /solicitar-demo-2/.
8. Corregir el filtro de temas del agente para que no publique temas repetidos (mismo arreglo que LabLab).
