# 02 — Sección de newsletter (NewsletterSection)

**Estado:** Implemented
**Dependencias:** Ninguna (usa los tokens de color y la textura `paper-grain` ya definidos en `global.css`; no depende del spec 01)
**Fecha:** 2026-07-27

**Objetivo:** Crear `NewsletterSection.astro`, una nueva sección de cierre para la landing con headline + formulario de suscripción (dos columnas en desktop), adaptada a la paleta clara del sitio, con reveal de entrada por bloques, textura de puntos en la base y un micro-interacción de flecha al hacer submit.

## Scope

**Incluido:**

- Nuevo componente `src/components/NewsletterSection.astro`, agregado en `src/pages/index.astro` después de `<ManifestoSection />`, como última sección de la landing.
- Layout de dos columnas en desktop (label + headline a la izquierda, formulario a la derecha), colapsando a una columna apilada en mobile.
- Copy generado ad-hoc para el proyecto (label tipo "Newsletter", headline, microcopy bajo el form), coherente en tono con el resto de la landing (ej. `ManifestoSection`).
- Formulario visual: input `type="email"` con `required` (validación nativa del navegador) + botón "Suscríbete" con ícono de flecha. Sin backend, sin fetch, sin llamada a ningún servicio — es maqueta funcional solo en el cliente.
- Micro-interacción de submit: al hacer click/submit con el input válido, el botón se transforma de "texto + flecha" a un botón circular con solo la flecha, y luego de un breve instante vuelve a su estado original (loop repetible, puramente decorativo, sin mensaje de éxito ni de error).
- Reveal de entrada por bloques (fade-up, disparo único vía `inView`, mismo patrón ya usado en `ManifestoSection` para `.manifesto-fade`): label → headline → form → microcopy, en stagger secuencial.
- Textura de puntos (reutilizando o adaptando la utility `paper-grain` existente) concentrada en la base de la sección, como respiro visual de cierre, igual a como aparece en la imagen de referencia.
- Respeto de `prefers-reduced-motion`: reveal de entrada y micro-interacción del botón deshabilitados (contenido visible de inmediato, botón sin animación de transformación al hacer click).

**No incluido:**

- Cualquier integración real de envío de email (Mailchimp, Resend, endpoint propio, etc.) — queda para un spec futuro.
- Mensajes de éxito/error, manejo de estados de carga, o persistencia del email ingresado.
- Reveal de palabras scroll-linked estilo `ManifestoSection` (spec 01) — esta sección usa fade-up simple por bloque, no scroll-linked continuo.
- Cambios a otras secciones de la landing (`Welcome`, `FeaturedArticle`, `CategoriesSection`, `ManifestoSection`) o al `Navbar`.
- Un footer separado — esta sección sigue siendo la última de la landing, no reemplaza ni introduce un `<footer>` de sitio.

## Data model

Esta sección se omite: la feature no introduce nuevas estructuras de datos persistentes. El único "dato" es el copy estático (label, headline, microcopy) definido como constantes dentro del frontmatter de `NewsletterSection.astro`, siguiendo el mismo patrón que `statement`/`lede`/`practices` en `ManifestoSection.astro`. El valor del input de email vive solo en el DOM del formulario, no se guarda ni se envía a ningún lado.

## Implementation plan

1. **Crear el componente `src/components/NewsletterSection.astro`** con el markup estático: bloque izquierdo (rule + label "Newsletter" + headline), bloque derecho (formulario con `<input type="email" required>` + botón "Suscríbete" con ícono de flecha, y microcopy debajo en dos líneas). Usar los tokens de color existentes (`bg-background`/`bg-surface`, `text-text`, `text-accent`, `border-border`) y el layout de dos columnas en `lg:grid-cols-[...]`, colapsando a una columna en mobile — siguiendo la estructura de `ManifestoSection.astro`. El sistema sigue funcional: la sección se ve estática, sin animaciones, en su lugar dentro de la grid.

2. **Registrar la sección en `src/pages/index.astro`**, importando `NewsletterSection` y agregándola después de `<ManifestoSection />`. El sistema sigue funcional: la landing ahora termina con la nueva sección visible.

3. **Añadir la textura de puntos en la base de la sección**, reutilizando la utility `paper-grain` de `global.css` (o una variante `paper-grain-fade` con `mask-image: linear-gradient(to top, black, transparent)` si se necesita que solo sea visible en la franja inferior, para no competir con el fondo claro de toda la sección). El sistema sigue funcional: la sección ahora coincide visualmente con la referencia en su base.

4. **Implementar el reveal de entrada por bloques** en un `<script>` inline (vanilla `motion`, mismo patrón que `ManifestoSection`): marcar label, headline, form y microcopy con una clase común (ej. `.newsletter-fade`), animarlos con `inView` + `animate` en stagger secuencial (label → headline → form → microcopy), con guard `prefers-reduced-motion` que deja todo visible sin animar. El sistema sigue funcional: la sección ahora aparece con fade-up al hacer scroll hasta ella.

5. **Implementar la micro-interacción del botón de submit**: en el mismo `<script>`, escuchar el `submit` del formulario, hacer `event.preventDefault()` (no hay backend), y alternar una clase (ej. `.newsletter-btn-sent`) que transforma el botón de "texto + flecha" a un círculo con solo la flecha (`width`, `border-radius`, opacidad del texto vía `motion`/transición CSS). Tras ~1.2s, remover la clase para que el botón vuelva a su estado original. Bajo `prefers-reduced-motion`, el `submit` sigue haciendo `preventDefault()` pero sin alternar la clase (sin transformación visual). El sistema sigue funcional: el botón ahora tiene su micro-interacción completa y repetible.

6. **Verificación responsive manual**: revisar en mobile (`sm`) y desktop (`lg`/`xl`) que el layout de dos columnas colapsa correctamente y que el texto/microcopy no rompe el word-wrap ni se superpone con la textura de puntos.

7. **Delegar el ajuste de curvas de easing y performance tiers al subagente `motion-animator`** durante `/spec-impl`, siguiendo las mismas reglas S/A-tier que en el spec 01 (animar `transform`/`opacity`, `will-change` puntual).

8. **Verificación final**: `pnpm dev`, comprobar visualmente el fade-up de entrada, hacer click en "Suscríbete" para confirmar la transformación circular y el retorno automático, activar `prefers-reduced-motion` y confirmar que la sección aparece estática y el botón no anima al click. Luego `pnpm build` y `pnpm lint`.

## Acceptance criteria

- [ ] `NewsletterSection.astro` existe en `src/components/` y se renderiza en `index.astro` inmediatamente después de `ManifestoSection`, como última sección de la landing.
- [ ] En desktop (`lg`+), la sección muestra dos columnas: label+headline a la izquierda, formulario (input+botón) y microcopy a la derecha; en mobile colapsa a una columna apilada sin overlaps ni scroll horizontal.
- [ ] El input de email es `type="email"` con `required`; intentar enviar el formulario vacío o con un valor no válido dispara la validación nativa del navegador (no hay envío ni cambio visual del botón).
- [ ] Al enviar el formulario con un email de formato válido, el botón se transforma de "texto + flecha" a un círculo con solo la flecha, y vuelve a su estado original automáticamente tras un breve instante, sin recargar la página ni hacer ninguna petición de red.
- [ ] Al hacer scroll hasta la sección, el label, el headline, el formulario y el microcopy aparecen con fade-up en stagger secuencial (label → headline → form → microcopy).
- [ ] La base de la sección muestra la textura de puntos, visualmente coherente con la referencia de la imagen y con el resto del sitio (misma familia de textura que `paper-grain`).
- [ ] Con `prefers-reduced-motion: reduce` activo: todos los bloques se muestran visibles de inmediato (sin fade-up), y el submit del formulario no produce ninguna transformación visual en el botón.
- [ ] `pnpm build` y `pnpm lint` pasan sin errores.
- [ ] No se agregaron nuevas dependencias de npm, ni configuración de Tailwind, ni llamadas de red reales.

## Decisiones tomadas y descartadas

- **Paleta clara adaptada, no fondo oscuro dedicado.** El usuario descartó explícitamente romper el tema claro del sitio con una sección de fondo oscuro (como en la imagen de referencia); se mantiene la consistencia visual con el resto de la landing usando los tokens ya definidos en `global.css`.

- **Fade-up simple por bloque, no reveal por palabra scroll-linked.** A diferencia de `ManifestoSection` (spec 01), esta sección usa el mecanismo `.manifesto-fade`-equivalente (disparo único vía `inView`), no el reveal palabra-por-palabra scroll-linked. El usuario confirmó que quiere una animación de entrada por partes, no el mismo mecanismo elaborado del manifiesto — mantiene la sección de cierre más simple.

- **Sin backend ni estados de éxito/error de verdad.** El formulario es una maqueta funcional en el cliente: valida formato de email de forma nativa y anima el botón al submit, pero no llama a ningún servicio ni persiste el email. La integración real queda explícitamente fuera de este spec para no mezclar UI con decisiones de proveedor de email marketing.

- **Micro-interacción del botón como loop repetible, no estado final permanente.** El usuario eligió que el botón vuelva a su forma original tras la transformación (en vez de quedar "enviado" permanentemente), para que la interacción se pueda probar repetidamente sin necesitar recargar la página — coherente con que no hay un envío real que justifique un estado final.

- **Textura de puntos reutilizando `paper-grain`, no un shader ni imagen nueva.** Se aprovecha la utility ya existente en `global.css` (posiblemente con una variante enmascarada hacia la base) en vez de introducir una nueva dependencia de generación de ruido/dither, manteniendo el enfoque "sin nuevas dependencias" del proyecto.

- **Copy generado ad-hoc para el proyecto.** El usuario delegó la redacción del headline y microcopy en vez de replicar literalmente el texto de la imagen de referencia, pidiendo que sea coherente con el tono ya establecido en `ManifestoSection`.

## Riesgos identificados

- **Layout shift del botón al transformarse en círculo.** Si el botón cambia de `width`/`border-radius` sin `flex-shrink`/`min-width` fijos en su contenedor, el input de al lado podría reflowar visualmente durante la transición. Mitigación: fijar un ancho mínimo en el contenedor del form o usar `position` estable para el botón durante la animación.

- **Textura de puntos enmascarada compitiendo con el fondo claro.** A diferencia de `ManifestoSection` (que usa `paper-grain` sobre toda la sección con una imagen central que aporta contraste), aquí la sección es mayormente texto sobre fondo claro; una textura de puntos muy visible en la base podría verse desalineada si no se ajusta bien la opacidad/tamaño respecto al resto del sitio. Mitigación: revisar visualmente y ajustar opacidad de la máscara durante `/spec-impl`.

- **Reentrada del `submit` antes de que termine el timeout de reversión.** Si el usuario hace click repetidamente antes de que pasen los ~1.2s, se podrían acumular múltiples `setTimeout` pisándose. Mitigación: limpiar el timeout anterior (`clearTimeout`) antes de programar uno nuevo, o ignorar submits mientras la animación está en curso.
