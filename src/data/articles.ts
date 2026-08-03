export type ArticleBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; level: 2 | 3; text: string; id: string }
    | { type: "quote"; text: string }
    | { type: "image"; src: string; alt: string; caption?: string };

export interface Article {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    tema: string;
    tipo: string;
    date: string;
    dateLabel: string;
    readingTime: string;
    image: string;
    author: string;
    authorRole: string;
    content: ArticleBlock[];
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function heading(level: 2 | 3, text: string): ArticleBlock {
    return { type: "heading", level, text, id: slugify(text) };
}

function p(text: string): ArticleBlock {
    return { type: "paragraph", text };
}

function quote(text: string): ArticleBlock {
    return { type: "quote", text };
}

const AUTHOR = "Luis David Rambao";
const AUTHOR_ROLE = "Fundador de Axiom";

export const articles: Article[] = [
    {
        slug: "automatizacion-inteligente-menos-esfuerzo-mas-valor",
        title: "Automatización inteligente: menos esfuerzo, más valor",
        excerpt:
            "Cómo la automatización y la IA están permitiendo a los equipos enfocarse en lo que realmente importa.",
        category: "Procesos",
        tema: "Automatización",
        tipo: "Artículo",
        date: "2024-05-24",
        dateLabel: "24 MAY 2024",
        readingTime: "5 min de lectura",
        image: "/hands-clean.jpg",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("Durante años, automatizar significó eliminar pasos manuales de un proceso ya definido. Hoy significa algo distinto: dejar que un sistema decida cuándo, cómo y si un paso debe ejecutarse en absoluto. Esa diferencia, sutil en apariencia, cambia por completo el retorno que un equipo puede esperar de la automatización."),
            p("Las organizaciones que más valor extraen no son las que automatizan más tareas, sino las que automatizan las correctas: aquellas donde el esfuerzo humano no aporta juicio, solo tiempo."),
            heading(2, "El esfuerzo no es el enemigo, la fricción sí"),
            p("Reducir esfuerzo suena bien en una diapositiva, pero el objetivo real es reducir fricción: el tiempo perdido entre que una decisión es necesaria y el momento en que alguien finalmente la toma. La automatización inteligente ataca ese espacio intermedio."),
            quote("No se trata de hacer más rápido lo mismo de siempre. Se trata de redefinir qué merece la atención de una persona."),
            p("Un equipo de soporte que automatiza la clasificación de tickets no está ahorrando clics: está liberando el criterio humano para los casos donde realmente importa."),
            heading(2, "De reglas fijas a sistemas que aprenden"),
            p("La automatización tradicional funciona con reglas: si ocurre X, entonces Y. Es predecible, pero frágil ante la excepción. Los sistemas actuales, apoyados en modelos de IA, ajustan su comportamiento según el contexto, sin perder la trazabilidad que una organización necesita para confiar en ellos."),
            p("Eso no vuelve innecesaria la supervisión humana. La vuelve más valiosa, porque se concentra en los casos límite en lugar de repetirse en cada transacción rutinaria."),
            heading(2, "Empezar pequeño, medir en serio"),
            p("Los proyectos de automatización que fracasan casi siempre comparten un patrón: se diseñaron para impresionar, no para medirse. Empezar por un flujo acotado, con una métrica clara de antes y después, es lo que distingue un piloto útil de un experimento decorativo."),
            p("El esfuerzo que se ahorra hoy debe traducirse en algo que la organización pueda nombrar: horas, decisiones más rápidas, clientes mejor atendidos. Si no puede nombrarse, probablemente no se ahorró nada."),
        ],
    },
    {
        slug: "como-tomar-mejores-decisiones-con-ia",
        title: "Cómo tomar mejores decisiones con IA",
        excerpt:
            "Un marco práctico para integrar inteligencia artificial en la toma de decisiones estratégicas.",
        category: "Estrategia",
        tema: "Toma de decisiones",
        tipo: "Guía",
        date: "2024-05-22",
        dateLabel: "22 MAY 2024",
        readingTime: "6 min de lectura",
        image: "/section.png",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("La inteligencia artificial no decide por nosotros: cambia la calidad de la información con la que decidimos. Esa distinción es la que separa a los equipos que usan IA como acelerador de los que la usan como excusa para no pensar."),
            heading(2, "El marco: contexto, opciones, consecuencias"),
            p("Un buen sistema de apoyo a la decisión no entrega una respuesta única, entrega un mapa: qué variables importan, qué opciones son viables y qué consecuencias razonables tiene cada una. La IA es especialmente buena construyendo ese mapa a partir de datos dispersos que ningún humano revisaría a tiempo."),
            p("El error común es pedirle al modelo una conclusión cerrada. La pregunta correcta casi siempre es abierta: ¿qué no estoy viendo?"),
            heading(2, "Dónde la IA ayuda y dónde estorba"),
            quote("Una decisión estratégica bien informada sigue siendo una decisión humana. La IA solo cambia qué tan cara es la ignorancia."),
            p("En decisiones reversibles y de alto volumen —precios, inventario, priorización de tickets— dejar que el sistema proponga y el humano confirme acelera todo el ciclo. En decisiones irreversibles o de alto impacto reputacional, el rol de la IA debe limitarse a iluminar, nunca a resolver."),
            heading(2, "Construir el hábito, no solo la herramienta"),
            p("Ningún modelo mejora una cultura donde nadie cuestiona sus propios supuestos. El verdadero cambio ocurre cuando los equipos empiezan a pedir evidencia antes de decidir, con o sin IA de por medio, y la usan simplemente porque reduce el costo de obtenerla."),
            p("Ese hábito, una vez instalado, es la ventaja competitiva real. La herramienta es reemplazable; el criterio que exige mejores preguntas, no."),
        ],
    },
    {
        slug: "infraestructura-preparada-para-el-futuro",
        title: "Infraestructura preparada para el futuro",
        excerpt:
            "Principios clave para construir sistemas escalables, seguros y resilientes.",
        category: "Tecnología",
        tema: "Infraestructura",
        tipo: "Artículo",
        date: "2024-05-20",
        dateLabel: "20 MAY 2024",
        readingTime: "8 min de lectura",
        image: "/section2.png",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("La infraestructura rara vez se nota cuando funciona. Se nota cuando falla, cuando no escala o cuando cuesta más de lo que la organización puede sostener. Diseñarla bien es, sobre todo, diseñarla para el día en que algo salga mal."),
            heading(2, "Escalar es una decisión, no un accidente"),
            p("Los sistemas que escalan con gracia no lo hacen por suerte: fueron diseñados desde el inicio con límites explícitos y puntos de extensión claros. Escalar de forma reactiva, cuando la presión ya es insostenible, siempre cuesta más caro que planearlo con antelación razonable."),
            p("Eso no significa sobre-diseñar para un futuro hipotético. Significa dejar las puertas abiertas donde el crecimiento es probable, y cerradas donde no lo es."),
            heading(2, "Seguridad como propiedad del diseño"),
            quote("La seguridad que se añade al final siempre es más cara que la que se diseña al principio."),
            p("Tratar la seguridad como una capa que se agrega después garantiza fricción constante entre equipos de producto y de seguridad. Cuando los principios de mínimo privilegio y aislamiento están en el diseño desde el primer día, la seguridad deja de ser un obstáculo y se vuelve invisible."),
            heading(2, "Resiliencia: fallar pequeño, no fallar nunca"),
            p("Ningún sistema evita todas las fallas. Los sistemas resilientes las contienen: un componente que falla no debería derribar a los demás. Diseñar para fallos parciales, con reintentos, límites de tiempo y degradación controlada, es lo que separa una interrupción menor de un incidente mayor."),
            p("La resiliencia no se mide en la ausencia de errores, sino en la velocidad y elegancia con la que el sistema se recupera de ellos."),
            heading(3, "Tres señales de una infraestructura madura"),
            p("Documentación que se actualiza sola con el código, observabilidad que responde preguntas antes de que se hagan, y un equipo que puede desplegar cambios sin miedo. Cuando las tres coexisten, la infraestructura deja de ser un riesgo y se convierte en una ventaja."),
        ],
    },
    {
        slug: "el-rol-humano-en-la-era-de-la-inteligencia-artificial",
        title: "El rol humano en la era de la inteligencia artificial",
        excerpt:
            "Por qué la empatía, la cultura y la visión siguen siendo nuestra mayor ventaja competitiva.",
        category: "Liderazgo",
        tema: "Cultura organizacional",
        tipo: "Análisis",
        date: "2024-05-18",
        dateLabel: "18 MAY 2024",
        readingTime: "6 min de lectura",
        image: "/hands2.png",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("Cada vez que una tecnología promete reemplazar el trabajo humano, la conversación se vuelve binaria: sustitución total o resistencia inútil. La realidad de la IA en las organizaciones es más interesante y menos cómoda que cualquiera de las dos."),
            heading(2, "Lo que un modelo no puede cargar"),
            p("Un modelo puede redactar, resumir, predecir y clasificar. No puede asumir la responsabilidad de una decisión frente a un cliente, ni sostener la confianza de un equipo en un momento difícil. Esa carga sigue siendo, y probablemente seguirá siendo, humana."),
            quote("La tecnología cambia qué tan rápido trabajamos. La cultura decide si vale la pena trabajar así."),
            heading(2, "Empatía como ventaja operativa"),
            p("Las organizaciones que tratan la empatía como un valor decorativo pierden algo muy concreto: la capacidad de anticipar fricciones antes de que se conviertan en crisis. Los equipos con más contexto humano detectan señales que ningún dashboard captura a tiempo."),
            p("Automatizar el trabajo repetitivo libera tiempo. Lo que se hace con ese tiempo es lo que distingue a una cultura fuerte de una simplemente eficiente."),
            heading(2, "Visión: la parte que no se delega"),
            p("La IA puede optimizar casi cualquier proceso existente, pero no puede decidir qué proceso vale la pena tener. Esa es una pregunta de visión, y las organizaciones que la delegan por completo terminan optimizando caminos que nunca debieron tomar."),
        ],
    },
    {
        slug: "modelos-operativos-de-procesos-a-sistemas",
        title: "Modelos operativos: de procesos a sistemas",
        excerpt:
            "Cómo evolucionar de procesos aislados a sistemas inteligentes que generan valor.",
        category: "Tecnología",
        tema: "Modelos operativos",
        tipo: "Guía",
        date: "2024-05-16",
        dateLabel: "16 MAY 2024",
        readingTime: "7 min de lectura",
        image: "/hands.png",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("Un proceso resuelve un problema. Un sistema resuelve una familia de problemas relacionados, y aprende de cada uno de ellos. La transición de procesos aislados a sistemas conectados es, en el fondo, la historia de cómo maduran los modelos operativos."),
            heading(2, "El costo invisible de los procesos aislados"),
            p("Cada proceso que vive por su cuenta —su propia hoja de cálculo, su propio flujo de aprobación, su propio dueño— acumula una deuda silenciosa: nadie ve el patrón completo. Los problemas se resuelven una y otra vez, en paralelo, sin que la organización aprenda como conjunto."),
            heading(2, "Qué hace que algo sea un sistema"),
            quote("Un sistema no es más tecnología. Es más memoria organizacional."),
            p("Un sistema conecta las decisiones de hoy con los datos de ayer. Cuando un equipo de ventas cierra un trato, esa información debería mejorar cómo se prioriza el siguiente lead, no quedarse enterrada en un CRM que nadie vuelve a mirar."),
            p("Esa conexión —el ciclo de retroalimentación— es lo que separa un conjunto de herramientas de un modelo operativo real."),
            heading(2, "La migración gradual, no la revolución"),
            p("Rediseñar todo de una vez casi siempre falla. Los modelos operativos que evolucionan con éxito lo hacen conectando un proceso a la vez, validando que la retroalimentación mejora resultados antes de escalar la conexión al siguiente."),
            p("El objetivo final no es tener más sistemas. Es tener una organización que aprende más rápido de lo que olvida."),
        ],
    },
    {
        slug: "tendencias-en-ia-que-transformaran-la-proxima-decada",
        title: "Tendencias en IA que transformarán la próxima década",
        excerpt:
            "Una mirada a las tecnologías y enfoques que definirán el futuro de las organizaciones.",
        category: "Futuro",
        tema: "Transformación digital",
        tipo: "Artículo",
        date: "2024-05-12",
        dateLabel: "12 MAY 2024",
        readingTime: "9 min de lectura",
        image: "__dust__",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("Predecir tecnología a diez años es, casi siempre, un ejercicio de humildad. Pero algunas direcciones ya son lo bastante claras como para que ignorarlas sea la verdadera apuesta arriesgada."),
            heading(2, "De modelos generales a sistemas de agentes"),
            p("El salto que viene no es solo modelos más grandes, sino modelos que actúan: que ejecutan tareas de varios pasos, usan herramientas y corrigen su propio rumbo. Las organizaciones que aprendan a diseñar los límites de esa autonomía, y no solo su capacidad, tomarán la delantera."),
            heading(2, "Datos propios como el nuevo foso competitivo"),
            quote("Cuando el acceso a un modelo deja de ser una ventaja, la ventaja se mueve a los datos que nadie más tiene."),
            p("A medida que los modelos base se estandarizan, la diferencia competitiva se desplaza hacia los datos únicos de cada organización: su historial, su contexto, su forma particular de operar. Proteger y estructurar ese activo se vuelve tan importante como adoptar la tecnología misma."),
            heading(2, "Regulación como variable de diseño"),
            p("La IA dejó de ser un territorio sin reglas. Diseñar sistemas que asumen la auditoría y la explicabilidad como requisitos, no como parches posteriores, ahorrará años de reconstrucción a las organizaciones que empiecen ahora."),
            heading(2, "Lo que no cambiará"),
            p("Ninguna tendencia reemplaza la necesidad de un problema real que resolver. Las organizaciones que persigan tecnología por moda, sin una pregunta de negocio detrás, repetirán en esta década los mismos errores de la anterior."),
        ],
    },
    {
        slug: "como-la-ia-aplicada-esta-cambiando-la-estrategia-de-producto",
        title: "Cómo la IA aplicada está cambiando la estrategia de producto",
        excerpt:
            "Casos reales de equipos que integraron IA aplicada en su proceso de decisión sin perder criterio humano.",
        category: "Estrategia",
        tema: "IA aplicada",
        tipo: "Artículo",
        date: "2024-05-10",
        dateLabel: "10 MAY 2024",
        readingTime: "6 min de lectura",
        image: "/category1.webp",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("La inteligencia artificial ya no es una ventaja competitiva. Es una nueva capa estructural en los modelos operativos de las organizaciones modernas."),
            p("Lo que antes era automatización, hoy es orquestación inteligente de procesos, decisiones y experiencias. Las empresas que entienden ese cambio no están simplemente reduciendo costos: están creando sistemas más adaptativos, resilientes y centrados en el impacto real."),
            heading(2, "De la automatización a la inteligencia aplicada"),
            p("Automatizar tareas fue el primer paso. Lo siguiente es más profundo: integrar inteligencia en los flujos de trabajo para mejorar decisiones, anticipar escenarios y liberar el potencial humano."),
            quote("No se trata de hacer más con IA. Se trata de redefinir qué vale la pena hacer."),
            p("Las organizaciones líderes están rediseñando sus procesos desde cero, con IA como parte nativa del sistema, no como una herramienta adicional."),
            heading(2, "Criterio humano, ahora con mejor información"),
            p("En los equipos de producto que mejor integran IA aplicada, el criterio humano no desaparece: se ejerce sobre mejores señales. Priorizar el roadmap, decidir qué construir y qué descartar, sigue siendo una conversación humana apoyada en evidencia más rica."),
            p("El resultado no es un producto diseñado por un algoritmo, sino un equipo que discute menos sobre suposiciones y más sobre trade-offs reales."),
        ],
    },
    {
        slug: "productividad-sin-friccion-redisenar-el-dia-de-trabajo",
        title: "Productividad sin fricción: rediseñar el día de trabajo",
        excerpt:
            "Menos herramientas, más foco: cómo simplificar el flujo de trabajo diario de un equipo.",
        category: "Procesos",
        tema: "Productividad",
        tipo: "Guía",
        date: "2024-05-08",
        dateLabel: "08 MAY 2024",
        readingTime: "5 min de lectura",
        image: "/category2.webp",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("Cada herramienta nueva promete ahorrar tiempo. Sumadas, terminan haciendo lo contrario: cada cambio de contexto entre aplicaciones tiene un costo cognitivo que rara vez se mide, pero que se siente al final del día."),
            heading(2, "El verdadero enemigo es el cambio de contexto"),
            p("No es la cantidad de trabajo lo que agota a un equipo, es la fragmentación de la atención entre demasiadas superficies: el chat, el correo, el tablero, la hoja de cálculo. Rediseñar el día de trabajo empieza por reducir ese número, no por optimizar cada herramienta por separado."),
            quote("Menos herramientas, usadas con intención, superan a muchas herramientas usadas por costumbre."),
            heading(2, "Diseñar bloques, no solo tareas"),
            p("Un día productivo no es una lista de tareas completadas, es una secuencia de bloques de atención protegidos. Los equipos que definen ventanas claras para trabajo profundo y ventanas separadas para comunicación reducen fricción sin reducir horas."),
            p("La clave no está en trabajar más rápido dentro de cada bloque, sino en dejar de interrumpirlos constantemente."),
            heading(2, "Simplificar es una decisión de liderazgo"),
            p("Ningún equipo simplifica su flujo de trabajo por iniciativa individual si el liderazgo sigue premiando la disponibilidad constante. Rediseñar el día de trabajo requiere permiso explícito para ignorar notificaciones, y ese permiso solo lo da quien lidera."),
        ],
    },
    {
        slug: "automatizar-sin-perder-el-control",
        title: "Automatizar sin perder el control",
        excerpt:
            "Qué automatizar primero y qué dejar en manos humanas cuando se escala un sistema.",
        category: "Tecnología",
        tema: "Automatización",
        tipo: "Análisis",
        date: "2024-05-06",
        dateLabel: "06 MAY 2024",
        readingTime: "7 min de lectura",
        image: "/category3.webp",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("Escalar un sistema automatizado no es solo una pregunta técnica. Es, sobre todo, una pregunta de gobernanza: quién decide qué cuando la máquina se equivoca, y qué tan rápido se entera alguien de que ocurrió."),
            heading(2, "El orden importa: primero lo reversible"),
            p("Automatizar decisiones reversibles y de bajo riesgo es el punto de partida correcto. Permite ganar confianza en el sistema sin exponer a la organización a errores costosos mientras el modelo todavía está aprendiendo los límites del proceso real."),
            heading(2, "Dejar un humano en el bucle, con propósito"),
            quote("Un humano en el bucle que no puede intervenir a tiempo no es control, es una ilusión de control."),
            p("Incluir revisión humana solo tiene sentido si esa persona tiene el tiempo, el contexto y la autoridad para actuar antes de que el error se propague. Un punto de control decorativo, que nadie revisa realmente, es peor que no tenerlo: da una falsa sensación de seguridad."),
            heading(2, "Señales de que se automatizó demasiado rápido"),
            p("Cuando nadie en el equipo puede explicar por qué el sistema tomó una decisión específica, o cuando corregir un error requiere más esfuerzo del que tomaba hacerlo manualmente, es momento de retroceder un paso antes de seguir escalando."),
            p("El control no se pierde de golpe. Se erosiona en pequeñas decisiones de conveniencia que nadie revisó dos veces."),
        ],
    },
    {
        slug: "infraestructura-como-ventaja-de-liderazgo",
        title: "Infraestructura como ventaja de liderazgo",
        excerpt:
            "Por qué las decisiones técnicas también son decisiones de liderazgo.",
        category: "Liderazgo",
        tema: "Infraestructura",
        tipo: "Artículo",
        date: "2024-05-03",
        dateLabel: "03 MAY 2024",
        readingTime: "6 min de lectura",
        image: "/category4.webp",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("Es fácil tratar la infraestructura como un tema exclusivamente técnico y delegarlo por completo. Es un error caro: cada decisión de infraestructura es también una decisión sobre qué tan rápido puede moverse la organización en el futuro."),
            heading(2, "La deuda técnica es deuda de liderazgo"),
            p("Cuando un equipo pospone una decisión de infraestructura por presión de entrega, no está evitando el costo, lo está transfiriendo a un líder futuro que tendrá menos contexto y menos tiempo para pagarlo. Nombrar esa deuda explícitamente es una responsabilidad de liderazgo, no solo de ingeniería."),
            quote("Ningún equipo de liderazgo entendería aceptar deuda financiera sin visibilidad. La deuda técnica merece el mismo estándar."),
            heading(2, "Invertir en lo invisible"),
            p("La infraestructura bien hecha rara vez se nota, y por eso es difícil de defender frente a inversiones más visibles. Los líderes que protegen ese presupuesto entienden que la velocidad futura del equipo depende de decisiones que hoy parecen innecesarias."),
            heading(2, "Preguntas que todo líder debería hacer"),
            p("¿Qué pasa si este sistema recibe diez veces más carga? ¿Qué tan rápido podemos recuperarnos de una falla? ¿Quién entiende esta parte del sistema además de la persona que la construyó? Las respuestas a estas preguntas dicen más sobre la madurez de un equipo que cualquier métrica de producto."),
        ],
    },
    {
        slug: "el-costo-oculto-de-decidir-tarde",
        title: "El costo oculto de decidir tarde",
        excerpt:
            "Un marco simple para reducir la fricción en decisiones estratégicas de equipo.",
        category: "Estrategia",
        tema: "Toma de decisiones",
        tipo: "Guía",
        date: "2024-04-29",
        dateLabel: "29 ABR 2024",
        readingTime: "5 min de lectura",
        image: "/header.webp",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("Decidir tarde rara vez se siente como un error. Se siente como prudencia. Pero el costo de esperar información perfecta casi siempre supera el costo de equivocarse con información suficiente."),
            heading(2, "El precio invisible de la espera"),
            p("Cada semana que una decisión estratégica queda abierta, el equipo sigue operando bajo la incertidumbre anterior: recursos mal asignados, prioridades ambiguas, energía dispersa en escenarios que nunca se van a materializar todos a la vez."),
            quote("Esperar más información casi nunca es gratis. Solo parece gratis porque el costo no aparece en ningún reporte."),
            heading(2, "Un marco simple: reversible vs. irreversible"),
            p("La pregunta que más acelera una decisión no es '¿tenemos suficiente información?', es '¿podemos deshacer esto si nos equivocamos?'. Las decisiones reversibles merecen velocidad. Las irreversibles merecen el tiempo que están tomando."),
            p("Confundir unas con otras es la causa más común de decisiones lentas que no necesitaban serlo."),
            heading(2, "Poner fecha a la indecisión"),
            p("Asignar una fecha límite explícita a cada decisión pendiente, incluso una arbitraria, cambia la conversación de 'sigamos pensando' a 'qué necesitamos saber antes de esa fecha'. La restricción de tiempo no reduce la calidad de la decisión: reduce el tiempo que pasa sin tomarse ninguna."),
        ],
    },
    {
        slug: "organizaciones-que-se-transforman-antes-de-tener-que-hacerlo",
        title: "Organizaciones que se transforman antes de tener que hacerlo",
        excerpt:
            "Señales tempranas de que es momento de repensar cómo trabaja tu organización.",
        category: "Futuro",
        tema: "Transformación digital",
        tipo: "Análisis",
        date: "2024-04-25",
        dateLabel: "25 ABR 2024",
        readingTime: "8 min de lectura",
        image: "/hands-clean.jpg",
        author: AUTHOR,
        authorRole: AUTHOR_ROLE,
        content: [
            p("La mayoría de las transformaciones organizacionales ocurren bajo presión: una crisis, un competidor que avanza demasiado rápido, un mercado que cambió sin avisar. Las que ocurren antes de esa presión son mucho más raras, y mucho más valiosas."),
            heading(2, "La señal más temprana: preguntas que ya nadie responde bien"),
            p("Cuando las respuestas a preguntas básicas de operación empiezan a requerir cada vez más reuniones y cada vez menos certeza, es una señal de que la estructura actual ya no describe cómo funciona realmente la organización."),
            heading(2, "El costo de esperar la crisis"),
            quote("Transformarse bajo presión siempre cuesta más que transformarse por elección."),
            p("Una organización que espera la crisis para cambiar paga un costo doble: el de la crisis misma y el de un cambio hecho con prisa, sin el espacio para equivocarse y corregir que sí existe cuando la transformación es voluntaria."),
            heading(2, "Transformar sin romper lo que funciona"),
            p("No toda transformación exitosa empieza de cero. Las más efectivas identifican qué partes del modelo actual siguen generando valor y las protegen deliberadamente mientras rediseñan el resto. Cambiar todo a la vez es tan riesgoso como no cambiar nada."),
            heading(3, "Una pregunta para empezar"),
            p("Si tuviéramos que diseñar esta organización desde cero hoy, con lo que sabemos ahora, ¿se parecería a la que tenemos? La honestidad en esa respuesta es, casi siempre, el primer paso real hacia la transformación."),
        ],
    },
];

export const categories = Array.from(
    new Set(articles.map((article) => article.category))
).map((name) => ({
    name,
    count: articles.filter((article) => article.category === name).length,
}));

export const temasPopulares = [
    "Automatización",
    "IA aplicada",
    "Modelos operativos",
    "Transformación digital",
    "Toma de decisiones",
    "Productividad",
    "Infraestructura",
    "Cultura organizacional",
];

export const tipos = Array.from(
    new Set(articles.map((article) => article.tipo))
);

export function getArticleBySlug(slug: string): Article | undefined {
    return articles.find((article) => article.slug === slug);
}

export function getRelatedArticles(article: Article, count = 4): Article[] {
    const sameCategory = articles.filter(
        (a) => a.slug !== article.slug && a.category === article.category
    );
    const rest = articles.filter(
        (a) => a.slug !== article.slug && a.category !== article.category
    );
    return [...sameCategory, ...rest].slice(0, count);
}

export function getAdjacentArticles(article: Article) {
    const index = articles.findIndex((a) => a.slug === article.slug);
    return {
        previous: index > 0 ? articles[index - 1] : null,
        next: index < articles.length - 1 ? articles[index + 1] : null,
    };
}
