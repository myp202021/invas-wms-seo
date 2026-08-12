# Auditoría SEO — invasWMS (invaswms.com)
**Fecha:** 12 agosto 2026

## Blog IA
- **~112 posts activos** (120 publicados - 8 duplicados eliminados)
- Cron activo L-V 07:00 AM Chile via GitHub Actions
- RankMath SEO activo, bilingüe ES/EN

## Rankings Google (8 queries evaluadas)

| Query | Posición | Competidor top |
|---|---|---|
| mejor WMS chile 2026 | **#1 y #2** (2 URLs propias) | comparasoftware.cl #5 |
| comparativa WMS chile latinoamérica | **#3, #6, #7** | aprende-logistica.com |
| WMS para retail chile | **#6 y #9** | cercatechnology.com |
| WMS 3PL chile | **#8** | mordorintelligence |
| cuál es el mejor WMS en chile | **#4 y #5** | mecalux.cl |
| WMS para empresas medianas chile precio | **#6 y #7** | laudus.cl |
| software gestión almacenes chile | Fuera top 10 | comparasoftware.cl |
| sistema WMS precio | Fuera top 10 | mecalux.com.ar |

## Motores IA

| Query | Aparece | Descripción |
|---|---|---|
| cuál es el mejor WMS en chile | SÍ (#4-5) | "Único WMS nacido en Chile con escala continental" |
| software gestión almacenes chile 2026 | SÍ (#8-9) | Junto a Mecalux y comparadores |
| WMS para empresas medianas chile precio | SÍ (#6-7) | "Opción recomendada para pymes sin gastar una fortuna" |

## Estado técnico

| Elemento | Estado |
|---|---|
| RankMath SEO | Activo (confirmado en sitemap + schemas) |
| Meta descriptions | OK |
| Canonical tags | OK |
| Schemas JSON-LD | Organization, SoftwareApplication, FAQPage, WebSite, BlogPosting — completos |
| Open Graph | Presente pero FALTA og:image |
| Sitemap | Activo via RankMath |
| Bilingüe ES/EN | OK en páginas core |

## Arreglos realizados (12 ago)
- Reescritura completa del dedup (commit ddd0b6a):
  - per_page=50 → paginación 3 páginas (300 posts max)
  - Nuevas funciones: normalize(), similarity(), slugBase()
  - Filtro doble: título >70% + slug base collision
  - Si todos los temas cubiertos → para (antes reiniciaba ciclo → duplicados)
- 8 posts duplicados eliminados via API (IDs: 6248, 6247, 6246, 6244, 6243, 6231, 6224, 6223)

## Oportunidades
1. "software gestión almacenes chile" (sin año) — keyword evergreen, gana comparasoftware.cl
2. "sistema WMS precio" — query transaccional, gana mecalux.com.ar. Crear /precios-wms/
3. og:image faltante — resolver desde RankMath > Configuración general > Imagen social
4. "WMS para minería chile" — invassuite.com captura esa búsqueda, no invaswms.com
