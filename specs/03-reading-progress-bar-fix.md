# 03 — Fix del cálculo de progreso en ReadingProgressBar

**Estado:** Implemented
**Dependencias:** Ninguna formalmente registrada — corrige un bug en `ReadingProgressBar.tsx` y desincronización con `TableOfContents.tsx`, ambos introducidos como parte de la feature de artículos aún sin spec propio.
**Fecha:** 2026-07-31

**Objetivo:** Corregir `ReadingProgressBar` para que refleje con precisión cuánto del artículo se ha leído (sin completarse prematuramente en artículos cortos ni quedar desincronizado del scroll real), y unificar su lógica de medición con la de `TableOfContents` para que ambos coincidan siempre sobre la posición de lectura del usuario.

## Scope

**Incluido:**

- Reescribir el cálculo interno de `ReadingProgressBar.tsx`: reemplazar `useScroll` (offsets relativos al viewport `["start start", "end end"]`) por un cálculo manual basado en la posición absoluta del contenido (`getBoundingClientRect()` + `window.scrollY`), con guarda explícita para que un contenido más corto que el viewport no genere un rango invertido/progreso prematuro al 100%.
- Extraer un utilitario de medición de scroll compartido (nuevo módulo, ej. `src/components/articles/scrollTracking.ts`) que exponga la posición/lectura activa a partir de `[data-article-content]` y de los headings (`[data-toc-heading]`), para que tanto `ReadingProgressBar` como `TableOfContents` midan sobre la misma fuente de verdad en vez de dos listeners de scroll independientes con timing propio.
- Migrar `TableOfContents.tsx` para consumir ese mismo utilitario en lugar de su lógica actual de `scroll`/`resize` + `requestAnimationFrame` ad-hoc, manteniendo su comportamiento visible (indicador de sección activa) sin cambios.
- Mantener el límite conceptual actual: 0% al inicio de `[data-article-content]` (justo después de header/cover, como hoy) y 100% al final real de `ArticleBody` (antes de `ArticleNav`) — sin expandir el marcado a incluir `ArticleNav` ni `SigueExplorando`.
- Re-medir en `resize` y ante cambios de layout (ej. al abrir/cerrar el panel móvil de `TableOfContents`, o si el contenido cambia de altura tras cargar imágenes), no solo una vez al montar.
- Conservar el comportamiento actual de `prefers-reduced-motion` (spring casi instantáneo) y la hidratación `client:load` de ambos componentes.
- Verificación manual cruzando artículos cortos y largos de `src/data/articles.ts` para confirmar que el bug no reaparece en ningún caso.

**No incluido:**

- Rediseño visual de la barra (color, grosor `h-[3px]`, posición `top-0 z-[60]` sobre el `Navbar`) — se mantiene igual a hoy, este spec es solo de comportamiento/cálculo.
- Cambios visuales o de interacción en `TableOfContents` (estilos del indicador, dropdown móvil, scroll-to-heading) más allá de cambiar su fuente interna de medición.
- Agregar un indicador de progreso de lectura a `/articles` (listado) u otras páginas — queda limitado a la página de detalle de artículo.
- Cualquier persistencia o analítica del progreso de lectura (ej. guardar dónde se quedó el usuario).
- Cambiar dónde empieza/termina `data-article-content` en el markup de `[slug].astro` — se corrige el cálculo, no el punto de referencia.

## Data model

Esta sección se omite: la feature no introduce nuevas estructuras de datos persistentes ni nuevos tipos de contenido. El único "dato" nuevo es el estado interno de progreso (un número entre 0 y 1) que hoy vive en un `MotionValue` de `framer-motion` y pasará a vivir en un `useMotionValue`/estado derivado del utilitario compartido de medición de scroll — transitorio, solo en memoria del cliente, sin persistencia entre sesiones ni fuera del componente.

## Implementation plan

1. **Crear el utilitario compartido `src/components/articles/scrollTracking.ts`**, exponiendo funciones puras para: (a) obtener el rango absoluto `{ start, end }` de `[data-article-content]` (`getBoundingClientRect()` + `window.scrollY`), (b) calcular la fracción de progreso `clamp((scrollY - start) / (end - start - viewportHeight), 0, 1)`, con guarda explícita para cuando `end - start <= viewportHeight` (contenido más corto que el viewport) devolviendo `scrollY >= start ? 1 : 0` en vez de un valor invertido, y (c) determinar el heading activo a partir de `[data-toc-heading]` (misma lógica que hoy vive en `TableOfContents`). El sistema sigue funcional: archivo nuevo sin consumidores todavía, nada cambia visualmente.

2. **Refactorizar `ReadingProgressBar.tsx`** para dejar de usar `useScroll` de `motion/react` y en su lugar: escuchar `scroll`/`resize` con `requestAnimationFrame` (mismo patrón que ya usa `TableOfContents`), llamar al utilitario del paso 1 para obtener la fracción de progreso en cada frame, y alimentar un `useMotionValue` + `useSpring` con ese número para conservar la animación suave existente. El sistema sigue funcional: la barra ahora se calcula manualmente y ya no debería completarse prematuramente.

3. **Migrar `TableOfContents.tsx`** para que su `updateActive` use el mismo utilitario compartido (posición de headings, detección de "fin de página") en lugar de su lógica duplicada actual, sin tocar su comportamiento visible (indicador de sección activa, dropdown móvil). El sistema sigue funcional: el TOC se ve y comporta igual, pero ahora mide sobre la misma fuente que la barra.

4. **Agregar resiliencia a cambios de layout**: adjuntar un `ResizeObserver` sobre `[data-article-content]` en ambos componentes (o centralizado en el utilitario) para recalcular cuando cambie su altura — ej. al expandir/colapsar el panel móvil del TOC, o cuando carguen imágenes dentro de `ArticleBody` — y no solo ante `resize` de ventana. El sistema sigue funcional: ambos componentes ahora se re-miden ante cambios de altura del contenido, no solo al montar.

5. **Verificación manual cruzada** en varios artículos de `src/data/articles.ts` (al menos uno corto y uno largo, con y sin TOC visible): confirmar que la barra llega a 100% solo al final real del artículo, que nunca se completa antes de tiempo, y que su avance coincide con el heading activo marcado en el TOC en todo momento.

6. **Verificación final**: `pnpm dev`, revisar visualmente en desktop y mobile, activar `prefers-reduced-motion` y confirmar que la barra sigue respondiendo sin el spring (salto casi instantáneo) pero sin el bug. Luego `pnpm build` y `pnpm lint`.

## Acceptance criteria

- [ ] En un artículo cuyo `ArticleBody` es más corto que la altura del viewport, la barra de progreso **no** llega a 100% hasta que el usuario efectivamente termina de leer el contenido (ya no se completa prematuramente).
- [ ] En un artículo largo (con TOC visible), al hacer scroll el porcentaje de la barra avanza de forma continua y monótona (nunca retrocede salvo que el usuario scrollee hacia arriba).
- [ ] El heading marcado como activo en `TableOfContents` y el avance de `ReadingProgressBar` están siempre en sintonía: si el usuario está en la sección 2 de 4 del TOC, la barra no puede mostrar 100%.
- [ ] Redimensionar la ventana, o abrir/cerrar el panel móvil del TOC (que cambia la altura del layout), no deja el cálculo de progreso desincronizado — se re-mide correctamente tras el cambio.
- [ ] Con `prefers-reduced-motion: reduce` activo, la barra sigue reflejando el progreso real (sin el spring suave) y no reintroduce el bug.
- [ ] `ReadingProgressBar.tsx` y `TableOfContents.tsx` comparten la misma fuente de medición de scroll (`scrollTracking.ts`), sin lógica de cálculo de posición duplicada entre ambos.
- [ ] `pnpm build` y `pnpm lint` pasan sin errores.
- [ ] No se agregaron nuevas dependencias de npm; el rango de 0%/100% (`data-article-content`) no cambió en el markup de `[slug].astro`.

## Decisiones tomadas y descartadas

- **Cálculo manual con guarda anti-inversión, en vez de seguir con `useScroll` de `motion/react`.** El offset `["start start", "end end"]` de `useScroll` asume que el elemento medido es más alto que el viewport; cuando no lo es, el punto "end end" ocurre en una posición de scroll _anterior_ al punto "start start", invirtiendo el rango y disparando 100% casi de inmediato. Se descartó ajustar solo los offsets (ej. probar `["start end", "end start"]`) porque cambia el rango completo del comportamiento (0%/100% ocurrirían en puntos distintos a los definidos en el header) en vez de corregir el bug puntual.

- **Un utilitario compartido (`scrollTracking.ts`), no dos implementaciones corregidas por separado.** Se descartó simplemente arreglar `ReadingProgressBar` y dejar `TableOfContents` con su lógica actual, porque aunque cada uno midiera "correctamente" por separado, seguirían pudiendo desincronizarse por tener timing y fuentes de posición distintas (el bug reportado de "no funciona con el TOC" es justamente esa falta de una fuente única de verdad).

- **El límite 0%/100% se mantiene igual a hoy (`data-article-content`, sin incluir `ArticleNav`).** El usuario confirmó que el problema es el _cálculo_, no dónde empieza o termina conceptualmente el artículo — se descarta expandir el marcado del `[slug].astro` para no introducir cambios de scope no solicitados.

- **`ResizeObserver` sobre el contenido, no solo `window.resize`.** Se descartó depender únicamente del resize de ventana porque el bug también se manifiesta ante cambios de altura del contenido sin que la ventana cambie de tamaño (ej. el TOC móvil se expande, o una imagen tarda en cargar) — un caso plausible de por qué "a veces funciona y luego se rompe".

- **Sin rediseño visual.** Se descartó tocar color, grosor o z-index de la barra: el usuario pidió corregir el comportamiento, no la apariencia.

## Riesgos identificados

- **Regresión en la altura activa del TOC al migrar su lógica interna.** Al mover `updateActive` para consumir el utilitario compartido, existe riesgo de alterar sutilmente cuándo cambia el heading activo (ej. el offset `NAV_OFFSET = 128` usado hoy). Mitigación: conservar ese offset dentro del utilitario y verificar visualmente que el indicador de sección activa no cambia de comportamiento tras la migración.

- **Costo de un `ResizeObserver` adicional por artículo.** Agregar observers sobre `[data-article-content]` en dos componentes con `client:load` suma trabajo en cada carga de página de artículo. Mitigación: un solo `ResizeObserver` centralizado en el utilitario compartido (no uno por componente) que notifique a ambos consumidores.

- **Artículos extremadamente cortos (más cortos que el propio viewport en mobile) siguen siendo un caso límite.** Aunque la guarda anti-inversión evita el bug reportado, en el caso extremo de un artículo brevísimo la barra pasará de 0% a 100% casi sin transición perceptible al hacer scroll. Mitigación: aceptar este comportamiento como correcto (no hay progreso intermedio real que mostrar) y confirmarlo durante la verificación manual del paso 5, no tratarlo como bug.
