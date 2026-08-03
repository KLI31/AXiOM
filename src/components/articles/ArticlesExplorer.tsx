import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
    articles as allArticles,
    categories,
    temasPopulares,
    tipos,
    type Article,
} from "@/data/articles";
import DustThumbnail from "@/components/articles/DustThumbnail";
import FilterDropdown from "@/components/articles/FilterDropdown";

const sortOptions = [
    { value: "recientes", label: "Más recientes" },
    { value: "antiguos", label: "Más antiguos" },
    { value: "titulo", label: "Título A-Z" },
] as const;

type SortValue = (typeof sortOptions)[number]["value"];

const PAGE_SIZE = 6;

function FilterIcon() {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            aria-hidden="true"
            className="h-4 w-4"
        >
            <path d="M2 4h12M2 8h8M2 12h5" />
            <circle cx="12.5" cy="8" r="1.1" />
            <circle cx="8.5" cy="12" r="1.1" />
        </svg>
    );
}

function toOptions(label: string, values: string[]) {
    return [
        { value: "", label },
        ...values.map((v) => ({ value: v, label: v })),
    ];
}

function thumbnailFor(article: Article) {
    if (article.image === "__dust__") {
        return <DustThumbnail />;
    }
    return (
        <img
            src={article.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
    );
}

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function ArticlesExplorer() {
    const shouldReduceMotion = useReducedMotion();
    const [category, setCategory] = useState("");
    const [tema, setTema] = useState("");
    const [tipo, setTipo] = useState("");
    const [sort, setSort] = useState<SortValue>("recientes");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        let result = allArticles.filter((article) => {
            if (category && article.category !== category) return false;
            if (tema && article.tema !== tema) return false;
            if (tipo && article.tipo !== tipo) return false;
            return true;
        });

        result = [...result].sort((a, b) => {
            if (sort === "titulo") return a.title.localeCompare(b.title, "es");
            const diff =
                new Date(a.date).getTime() - new Date(b.date).getTime();
            return sort === "antiguos" ? diff : -diff;
        });

        return result;
    }, [category, tema, tipo, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageArticles = filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    function updateFilter(setter: (value: string) => void, value: string) {
        setter(value);
        setPage(1);
    }

    function toggleTema(name: string) {
        updateFilter(setTema, tema === name ? "" : name);
    }

    function toggleCategory(name: string) {
        updateFilter(setCategory, category === name ? "" : name);
    }

    const hasActiveFilters = Boolean(category || tema || tipo);

    function clearFilters() {
        setCategory("");
        setTema("");
        setTipo("");
        setPage(1);
    }

    return (
        <div className="mx-auto grid w-full max-w-360 gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1fr_320px] lg:gap-16 lg:px-12 lg:py-16 xl:px-16">
            <div>
                <motion.div
                    initial={{
                        opacity: shouldReduceMotion ? 1 : 0,
                        y: shouldReduceMotion ? 0 : -10,
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    className="border-border flex flex-wrap items-center gap-x-6 gap-y-3 border-b pb-5"
                >
                    <span className="text-text flex shrink-0 items-center gap-2 text-sm font-medium">
                        <FilterIcon />
                        Filtrar
                    </span>
                    <span
                        aria-hidden="true"
                        className="bg-border hidden h-4 w-px sm:block"
                    />
                    <FilterDropdown
                        label="Categoría"
                        value={category}
                        options={toOptions(
                            "Todas las categorías",
                            categories.map((c) => c.name)
                        )}
                        onChange={(v) => updateFilter(setCategory, v)}
                    />
                    <FilterDropdown
                        label="Tema"
                        value={tema}
                        options={toOptions("Todos los temas", temasPopulares)}
                        onChange={(v) => updateFilter(setTema, v)}
                    />
                    <FilterDropdown
                        label="Tipo"
                        value={tipo}
                        options={toOptions("Todos los tipos", tipos)}
                        onChange={(v) => updateFilter(setTipo, v)}
                    />

                    <div className="ml-auto flex shrink-0 items-center gap-1.5">
                        <span className="text-text-secondary text-sm">
                            Ordenar por:
                        </span>
                        <FilterDropdown
                            label=""
                            value={sort}
                            options={[...sortOptions]}
                            onChange={(v) => setSort(v as SortValue)}
                            align="right"
                            triggerClassName="text-text hover:text-accent"
                        />
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {pageArticles.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{
                                opacity: shouldReduceMotion ? 1 : 0,
                            }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: easeOut }}
                            className="flex flex-col items-start gap-4 py-20"
                        >
                            <p className="text-text text-lg font-medium">
                                No hay artículos con esos filtros.
                            </p>
                            <p className="text-text-secondary max-w-sm text-sm leading-relaxed">
                                Prueba a quitar alguno de los filtros activos o
                                explora otra categoría o tema.
                            </p>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-accent border-accent/40 hover:border-accent border-b text-sm font-medium transition-colors"
                            >
                                Quitar filtros
                            </button>
                        </motion.div>
                    ) : (
                        <motion.ul
                            key={`${currentPage}-${category}-${tema}-${tipo}-${sort}`}
                            className="flex flex-col"
                        >
                            {pageArticles.map((article, index) => (
                                <motion.li
                                    key={article.slug}
                                    layout
                                    initial={{
                                        opacity: shouldReduceMotion ? 1 : 0,
                                        y: shouldReduceMotion ? 0 : 14,
                                    }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{
                                        opacity: shouldReduceMotion ? 1 : 0,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: shouldReduceMotion
                                            ? 0
                                            : index * 0.06,
                                        ease: easeOut,
                                    }}
                                    className="border-border group border-t first:border-t-0"
                                >
                                    <a
                                        href={`/articles/${article.slug}`}
                                        className="flex flex-col gap-5 py-8 sm:flex-row sm:items-start"
                                    >
                                        <div className="aspect-[4/3] w-full shrink-0 overflow-hidden sm:w-56 lg:w-60">
                                            {thumbnailFor(article)}
                                        </div>

                                        <div className="flex flex-1 flex-col">
                                            <div className="mb-2 flex items-center gap-3">
                                                <span className="text-accent text-xs font-medium tracking-widest uppercase">
                                                    {article.category}
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className="text-text-secondary/50 text-xs"
                                                >
                                                    ·
                                                </span>
                                                <span className="text-text-secondary text-xs">
                                                    {article.readingTime}
                                                </span>
                                            </div>

                                            <h3 className="text-text group-hover:text-accent mb-2 text-lg font-medium transition-colors sm:text-xl">
                                                {article.title}
                                            </h3>

                                            <p className="text-text-secondary mb-3 max-w-lg text-sm leading-relaxed">
                                                {article.excerpt}
                                            </p>

                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="text-text-secondary/70 text-xs">
                                                    {article.dateLabel}
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className="text-text-secondary/60 group-hover:text-text shrink-0 text-lg transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                >
                                                    →
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </AnimatePresence>

                {totalPages > 1 && (
                    <nav
                        aria-label="Paginación de artículos"
                        className="border-border mt-4 flex items-center gap-4 border-t pt-6"
                    >
                        <motion.button
                            type="button"
                            whileTap={
                                shouldReduceMotion ? undefined : { scale: 0.94 }
                            }
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="text-text hover:text-accent flex items-center gap-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-30"
                        >
                            <span aria-hidden="true">←</span>
                            Anterior
                        </motion.button>

                        <div className="flex items-center gap-4">
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((n) => (
                                <motion.button
                                    key={n}
                                    type="button"
                                    whileTap={
                                        shouldReduceMotion
                                            ? undefined
                                            : { scale: 0.9 }
                                    }
                                    onClick={() => setPage(n)}
                                    aria-current={
                                        n === currentPage ? "page" : undefined
                                    }
                                    className={
                                        n === currentPage
                                            ? "text-text text-sm font-medium underline underline-offset-4"
                                            : "text-text-secondary hover:text-text text-sm transition-colors"
                                    }
                                >
                                    {n}
                                </motion.button>
                            ))}
                        </div>

                        <motion.button
                            type="button"
                            whileTap={
                                shouldReduceMotion ? undefined : { scale: 0.94 }
                            }
                            onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage === totalPages}
                            className="text-text hover:text-accent ml-auto flex items-center gap-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-30"
                        >
                            Siguiente
                            <span aria-hidden="true">→</span>
                        </motion.button>
                    </nav>
                )}
            </div>

            <aside className="border-border divide-border flex flex-col divide-y">
                <motion.div
                    initial={{
                        opacity: shouldReduceMotion ? 1 : 0,
                        y: shouldReduceMotion ? 0 : 14,
                    }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    className="pb-10"
                >
                    <h2 className="text-text mb-5 text-xs font-medium tracking-[0.2em] uppercase">
                        Categorías
                    </h2>
                    <ul className="flex flex-col gap-3">
                        {categories.map((cat) => (
                            <li key={cat.name}>
                                <motion.button
                                    type="button"
                                    whileTap={
                                        shouldReduceMotion
                                            ? undefined
                                            : { scale: 0.97 }
                                    }
                                    onClick={() => toggleCategory(cat.name)}
                                    aria-pressed={category === cat.name}
                                    className={
                                        "flex w-full items-center justify-between text-sm transition-colors " +
                                        (category === cat.name
                                            ? "text-accent font-medium"
                                            : "text-text-secondary hover:text-text")
                                    }
                                >
                                    <span>{cat.name}</span>
                                    <span className="tabular-nums">
                                        {cat.count}
                                    </span>
                                </motion.button>
                            </li>
                        ))}
                    </ul>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-text-secondary hover:text-text mt-5 text-xs underline underline-offset-4 transition-colors"
                        >
                            Quitar filtros
                        </button>
                    )}
                </motion.div>

                <motion.div
                    initial={{
                        opacity: shouldReduceMotion ? 1 : 0,
                        y: shouldReduceMotion ? 0 : 14,
                    }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    className="py-10"
                >
                    <h2 className="text-text mb-5 text-xs font-medium tracking-[0.2em] uppercase">
                        Temas populares
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {temasPopulares.map((name) => {
                            const active = tema === name;
                            return (
                                <motion.button
                                    key={name}
                                    type="button"
                                    whileTap={
                                        shouldReduceMotion
                                            ? undefined
                                            : { scale: 0.94 }
                                    }
                                    onClick={() => toggleTema(name)}
                                    aria-pressed={active}
                                    className={
                                        "border px-3 py-1.5 text-xs transition-colors " +
                                        (active
                                            ? "bg-text text-background border-text"
                                            : "border-border text-text-secondary hover:border-text hover:text-text")
                                    }
                                >
                                    {name}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div
                    initial={{
                        opacity: shouldReduceMotion ? 1 : 0,
                        y: shouldReduceMotion ? 0 : 14,
                    }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                    transition={{ duration: 0.6, ease: easeOut }}
                    className="pt-10"
                >
                    <span className="text-accent mb-4 block text-xs font-medium tracking-[0.2em] uppercase">
                        Ideas cada semana
                    </span>
                    <h3 className="text-text mb-3 text-lg leading-[1.3] font-medium">
                        Reflexiones, herramientas y análisis directo a tu inbox.
                    </h3>
                    <p className="text-text-secondary mb-5 text-sm leading-relaxed">
                        Contenido exclusivo sobre tecnología, IA y sistemas que
                        optimizan el mañana.
                    </p>
                    <form
                        className="flex flex-col gap-3"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Tu correo electrónico"
                            className="border-border bg-background text-text placeholder:text-text-secondary focus:border-accent h-11 border px-4 text-sm outline-none"
                        />
                        <motion.button
                            type="submit"
                            whileTap={
                                shouldReduceMotion ? undefined : { scale: 0.97 }
                            }
                            className="bg-text text-background hover:bg-text/90 h-11 text-sm font-medium transition-colors"
                        >
                            Suscribirme
                        </motion.button>
                    </form>
                </motion.div>
            </aside>
        </div>
    );
}
