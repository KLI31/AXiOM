# 01 — Scroll-driven text reveal en ManifestoSection

**Estado:** Implemented
**Dependencias:** Ninguna (primer spec del proyecto)
**Fecha:** 2026-07-27

**Objetivo:** Convertir el reveal de palabras del statement (columna izquierda) de un trigger único `inView` a un efecto continuo ligado al progreso del scroll, y aplicar el mismo tratamiento de reveal por palabra al lede y las practices de la columna derecha en `ManifestoSection.astro`.

## Scope

**Incluido:**

- Convertir el reveal de palabras del `statement` (columna izquierda) de disparo único (`inView`) a un efecto continuo ligado al scroll: cada palabra pasa de opacidad/posición oculta a visible según el progreso de scroll de su propio bloque en el viewport.
- Aplicar el mismo tratamiento de reveal por palabra (split + scroll-linked) al `lede` y a cada `practice` de la columna derecha, reemplazando su actual fade-up disparado por `inView` (`.manifesto-fade`).
- Reutilizar/generalizar la función `splitLineIntoWords` existente para que sirva tanto para las líneas del statement como para los párrafos del lede/practices.
- Mantener el comportamiento de `prefers-reduced-motion` (texto visible sin animación).
- Mantener sin cambios: el parallax de la imagen central (`manifesto-parallax`), el reveal del glifo de cita (`manifesto-quote`), el clip-path de la imagen (`manifesto-media`), la línea decorativa (`manifesto-rule`) y el label ("Nuestro manifiesto").

**No incluido:**

- Cambios de layout, tipografía o contenido de los textos.
- Animaciones nuevas en la imagen, el glifo de cita o el label/rule.
- Un indicador visual de progreso de scroll (barra, porcentaje, etc.).
- Soporte para reordenar o rediseñar el efecto en mobile de forma distinta a desktop (se aplica el mismo mecanismo scroll-linked en todos los breakpoints, sujeto a `prefers-reduced-motion`).
- Cualquier cambio a otros componentes de la landing fuera de `ManifestoSection.astro`.

## Data model

Esta sección se omite: la feature no introduce nuevas estructuras de datos. Los arrays existentes (`statement`, `lede`, `practices`) permanecen sin cambios; solo se reutiliza/generaliza la lógica de split de palabras ya presente en el script.

## Implementation plan

1. **Generalizar `splitLineIntoWords`** para aceptar cualquier `HTMLElement` con texto plano (no solo `.manifesto-line-inner`), devolviendo los mismos pares `{ mask, word }`. El sistema sigue funcional: el statement se sigue viendo igual hasta el siguiente paso.

2. **Marcar los nuevos bloques objetivo en el markup**: añadir clases (`manifesto-lede`, `manifesto-practice`) al `<p>` del lede y a cada `<p>` de `practices`, quitando `manifesto-fade` de esos dos (el label/rule conservan su fade-up `inView` actual, ya que quedan fuera de scope). El sistema sigue funcional: no hay cambios visuales aún, solo hooks en el DOM.

3. **Aplicar split de palabras al lede y a cada practice** en `initManifestoAnimations`, generando sus `wordPairs` igual que para el statement. El sistema sigue funcional: el texto se sigue mostrando (sin animación todavía).

4. **Reemplazar el trigger `inView` del statement por un scroll-linked por palabra**: usar `scroll(animate(...), { target: <bloque>, offset: ["start 85%", "start 35%"] })` por palabra (o grupo de palabras vía `useTransform`-equivalente en vanilla `motion`, ajustando `opacity`/`y` en función del progreso), eliminando el `inView` + `statementPlayed` actual para ese bloque. El sistema sigue funcional: el statement anima con scroll real en vez de un solo disparo.

5. **Aplicar el mismo mecanismo scroll-linked por palabra al lede y a cada practice**, cada uno con su propio `target`/offset (no comparten timeline), eliminando su lógica `inView` (`.manifesto-fade` / `manifestoPlayed`) para esos dos elementos específicamente — el `rule` y el `labelRow` conservan su `inView` actual. El sistema sigue funcional: ambas columnas de texto ahora responden al scroll en tiempo real.

6. **Verificar estado `prefers-reduced-motion`**: confirmar que el bloque temprano que fuerza `opacity: 1` / `transform: none` sigue cubriendo lede y practices (ya lo hace vía `fades`, ajustar el selector si se quitó la clase `.manifesto-fade`).

7. **Delegar el ajuste fino de curvas de easing / performance tiers al subagente `motion-animator`** durante `/spec-impl`, siguiendo sus reglas S/A-tier (animar `transform`/`opacity`, `will-change` puntual, nada de `filter: blur()` en scroll).

8. **Verificación manual**: `pnpm dev`, revisar visualmente que el statement y el lede/practices se iluminan palabra por palabra a medida que se scrollea la sección, y que con `prefers-reduced-motion` activado el texto aparece estático.

## Acceptance criteria

- [ ] El statement (columna izquierda) ya no usa `inView` para su reveal de palabras: el reveal está ligado al progreso del scroll dentro de su propio rango (`offset`).
- [ ] Scrollear hacia atrás (hacia arriba) revierte visualmente el reveal del statement, ya que está ligado al progreso real y no es un disparo único.
- [ ] El lede y cada una de las `practices` de la columna derecha muestran el mismo tratamiento de reveal por palabra, cada uno con su propio progreso de scroll independiente.
- [ ] El `rule` y el `labelRow` de la columna derecha conservan su animación `inView` actual sin cambios.
- [ ] El parallax de la imagen, el reveal del glifo de cita y el clip-path de `manifesto-media` no presentan regresiones visuales.
- [ ] Con `prefers-reduced-motion: reduce` activo, el statement, el lede y las practices se muestran completos y estáticos (sin palabras ocultas ni en tránsito).
- [ ] `pnpm build` y `pnpm lint` pasan sin errores.
- [ ] No se agregaron nuevas dependencias de npm ni configuración de Tailwind.

## Decisiones tomadas y descartadas

- **Scroll-linked continuo con offset por elemento, en vez de un progreso único para toda la sección.** Se descartó atar el reveal al scroll completo de la sección (`["start end", "end start"]`, como el parallax de la imagen) porque dejaría palabras a medio iluminar durante un tramo largo de scroll, sintiéndose lento y desconectado de la lectura. Cada bloque (statement, lede, cada practice) usa su propio rango de entrada al viewport.

- **Reveal por palabra (mismo mecanismo visual que ya existe), no un efecto nuevo.** El usuario confirmó reutilizar el patrón de mask + rise + opacity ya implementado para el statement, en vez de introducir un tratamiento distinto (ej. cambio de color/tracking) para evitar inconsistencia visual entre columnas.

- **Se mantiene la librería `motion` (vanilla), no `motion/react`.** Aunque el subagente `motion-animator` está documentado principalmente para componentes React (`.tsx`), este archivo es un `.astro` con `<script>` inline sin React, por lo que se sigue usando la API vanilla de `motion` ya presente en el componente. El subagente se usa igual en `/spec-impl` para las decisiones de curvas de easing y tiers de performance, no para reescribir el componente a React.

- **`rule` y `labelRow` quedan fuera del scroll-driven reveal.** Se mantiene su animación `inView` actual porque el usuario no los mencionó como parte de "ambos textos" y cambiarlos introduciría un efecto no solicitado.

- **No se agrega indicador de progreso visual.** El usuario descartó explícitamente cualquier UI de progreso ("sin progreso" referido a UI, no al mecanismo de scroll-linking en sí).

## Riesgos identificados

- **Costo de performance con múltiples timelines scroll-linked.** Si cada palabra del lede/practices obtiene su propio `scroll(animate(...))` independiente, el número de listeners de scroll puede crecer mucho (decenas de palabras). Mitigación: agrupar el progreso por bloque (un solo `scroll()` por elemento que anima todas sus palabras vía un solo `MotionValue`/`useTransform`-equivalente) en vez de un `scroll()` por palabra.

- **Reflow al dividir texto en spans.** Envolver cada palabra en `<span>` puede alterar el word-wrap del párrafo (especialmente en `practices`, que tiene `max-w-[26ch]`), cambiando dónde caen los saltos de línea respecto al diseño actual. Mitigación: verificar visualmente en los breakpoints `sm`/`lg` tras el split.

- **Offset de scroll inconsistente entre breakpoints.** El rango `["start 85%", "start 35%"]` fue elegido para desktop; en mobile, donde `manifesto-media` tiene `min-h-[55vh]` y el layout es de una columna, el statement y el lede pueden entrar al viewport con timing distinto. Mitigación: revisar manualmente en mobile durante `/spec-impl` y ajustar el offset si el reveal se siente demasiado rápido o lento.
