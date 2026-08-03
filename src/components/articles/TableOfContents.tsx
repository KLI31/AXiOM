import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
    NAV_OFFSET,
    getActiveHeadingId,
    onContentResize,
} from "./scrollTracking";

interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

const easeOut = [0.22, 1, 0.36, 1] as const;

function readHeadings(): TocItem[] {
    if (typeof document === "undefined") return [];
    return Array.from(
        document.querySelectorAll<HTMLElement>("[data-toc-heading]")
    ).map((heading) => ({
        id: heading.id,
        text: heading.textContent ?? "",
        level: heading.tagName === "H3" ? 3 : 2,
    }));
}

export default function TableOfContents() {
    const shouldReduceMotion = useReducedMotion();
    const [items] = useState<TocItem[]>(readHeadings);
    const [activeId, setActiveId] = useState<string>("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const headings = Array.from(
            document.querySelectorAll<HTMLElement>("[data-toc-heading]")
        );

        if (!headings.length) return;

        let ticking = false;

        function updateActive() {
            ticking = false;
            setActiveId(getActiveHeadingId(headings, NAV_OFFSET));
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateActive);
        }

        updateActive();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        const unsubscribeResize = onContentResize(onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            unsubscribeResize();
        };
    }, []);

    function scrollToHeading(id: string) {
        const el = document.getElementById(id);
        if (!el) return;
        const top =
            el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({
            top,
            behavior: shouldReduceMotion ? "auto" : "smooth",
        });
        setOpen(false);
    }

    if (!items.length) return null;

    function renderItems(layoutIdPrefix: string) {
        return items.map((item) => {
            const active = activeId === item.id;
            return (
                <li
                    key={item.id}
                    className={
                        "relative " + (item.level === 3 ? "pl-8" : "pl-4")
                    }
                >
                    <button
                        type="button"
                        onClick={() => scrollToHeading(item.id)}
                        className={
                            "-ml-px block pl-4 text-left text-sm leading-snug transition-colors " +
                            (active
                                ? "text-accent font-medium"
                                : "text-text-secondary hover:text-text")
                        }
                    >
                        {item.text}
                    </button>
                    {active && (
                        <motion.span
                            layoutId={`${layoutIdPrefix}-toc-indicator`}
                            className="bg-accent absolute top-0 -left-px h-full w-px"
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 40,
                            }}
                        />
                    )}
                </li>
            );
        });
    }

    return (
        <>
            {/* Mobile / tablet / narrow desktop: collapsible panel, in normal flow */}
            <motion.div
                initial={{
                    opacity: shouldReduceMotion ? 1 : 0,
                    y: shouldReduceMotion ? 0 : 12,
                }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                transition={{ duration: 0.6, ease: easeOut }}
                className="border-border border xl:hidden"
            >
                <button
                    type="button"
                    onClick={() => setOpen((current) => !current)}
                    aria-expanded={open}
                    className="text-text flex w-full items-center justify-between px-4 py-3 text-xs font-medium tracking-[0.2em] uppercase"
                >
                    En este artículo
                    <span aria-hidden="true">{open ? "−" : "+"}</span>
                </button>
                <AnimatePresence initial={false}>
                    {open && (
                        <motion.div
                            key="toc-panel"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: easeOut }}
                            className="border-border overflow-hidden border-t"
                        >
                            <ul className="border-border flex flex-col gap-3 border-l px-4 py-4">
                                {renderItems("mobile")}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <div className="hidden xl:absolute xl:inset-y-0 xl:right-full xl:mr-25 xl:block xl:w-[200px]">
                <div className="xl:sticky xl:top-32">
                    <ul className="border-border flex max-h-[calc(100vh-9rem)] flex-col gap-3 overflow-y-auto border-l pl-4">
                        {renderItems("desktop")}
                    </ul>
                </div>
            </div>
        </>
    );
}
