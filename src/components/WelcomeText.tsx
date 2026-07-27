import { useRef } from "react";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from "framer-motion";

const heroEase = [0.22, 1, 0.36, 1] as const;

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.25,
            staggerChildren: 0.1,
        },
    },
};

const line = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.045 },
    },
};

const word = {
    hidden: { y: "110%" },
    visible: {
        y: "0%",
        transition: { duration: 0.75, ease: heroEase },
    },
};

const highlight = {
    hidden: { backgroundSize: "0% 100%" },
    visible: {
        backgroundSize: "100% 100%",
        transition: {
            duration: 0.7,
            ease: heroEase,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: heroEase,
        },
    },
};

const cta = {
    hidden: { opacity: 0, x: -16 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: heroEase,
        },
    },
};

function SplitWords({
    text,
    className,
}: {
    text: string;
    className?: string;
}) {
    const words = text.split(" ");

    return (
        <span className={className}>
            {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-1">
                    <motion.span className="inline-block" variants={word}>
                        {w}
                        {i < words.length - 1 ? " " : ""}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}

export default function WelcomeText() {
    const prefersReducedMotion = useReducedMotion();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
    const rotateX = useSpring(
        useTransform(mouseY, [-0.5, 0.5], [3, -3]),
        springConfig
    );
    const rotateY = useSpring(
        useTransform(mouseX, [-0.5, 0.5], [-3, 3]),
        springConfig
    );
    const translateX = useSpring(
        useTransform(mouseX, [-0.5, 0.5], [-6, 6]),
        springConfig
    );
    const translateY = useSpring(
        useTransform(mouseY, [-0.5, 0.5], [-4, 4]),
        springConfig
    );

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        if (prefersReducedMotion || !wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
    }

    function handlePointerLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    return (
        <motion.div
            ref={wrapperRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={
                prefersReducedMotion
                    ? undefined
                    : { rotateX, rotateY, x: translateX, y: translateY }
            }
            className="max-w-xl pt-28 pb-20 [perspective:1200px] sm:pt-24 sm:pl-8 lg:pl-16"
        >
            <motion.h1
                variants={container}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
                className="mt-12 text-[clamp(3.2rem,9vw,6rem)] leading-[1.0] font-medium tracking-[-0.02em] text-stone-950"
            >
                <motion.span className="mb-4 block" variants={line}>
                    <SplitWords text="Aprendiendo sobre" />
                </motion.span>
                <motion.span
                    className="mb-4 block w-fit bg-no-repeat"
                    variants={line}
                >
                    <span className="inline-block overflow-hidden pb-1">
                        <motion.span
                            className="inline-block bg-no-repeat"
                            variants={word}
                            style={{
                                backgroundImage:
                                    "linear-gradient(90deg, #E8D47A 0%, #E8D47A 100%)",
                                backgroundPosition: "0 0",
                            }}
                        >
                            <motion.span
                                className="inline-block bg-no-repeat"
                                variants={highlight}
                                style={{
                                    backgroundImage:
                                        "linear-gradient(90deg, #E8D47A 0%, #E8D47A 100%)",
                                    backgroundPosition: "0 0",
                                    backgroundSize: "0% 100%",
                                }}
                            >
                                tecnología,
                            </motion.span>
                        </motion.span>
                    </span>
                </motion.span>
                <motion.span className="block w-2xl" variants={line}>
                    <SplitWords text="IA y software." />
                </motion.span>
            </motion.h1>

            <motion.p
                className="mt-9 max-w-84 text-[15px] leading-relaxed text-stone-600"
                variants={fadeUp}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
                transition={{ delay: 0.95 }}
            >
                Un lugar para pensar, construir y compartir ideas con calma.
            </motion.p>

            <motion.a
                href="/articles"
                className="group mt-8 flex w-full max-w-88 items-center justify-between border-b border-stone-950/20 pb-3 text-sm font-medium text-stone-950 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f1ec]"
                variants={cta}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
                transition={{ delay: 1.15 }}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
            >
                <motion.span
                    initial="rest"
                    variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    Explorar artículos
                </motion.span>
                <motion.span
                    aria-hidden="true"
                    className="relative block h-5 w-5 overflow-hidden text-base"
                >
                    <motion.span
                        initial="rest"
                        className="absolute inset-0 flex items-center justify-center"
                        variants={{
                            rest: { x: 0, y: 0, opacity: 1 },
                            hover: { x: 14, y: -14, opacity: 0 },
                        }}
                        transition={{ duration: 0.3, ease: heroEase }}
                    >
                        →
                    </motion.span>
                    <motion.span
                        initial="rest"
                        className="absolute inset-0 flex items-center justify-center"
                        variants={{
                            rest: { x: -14, y: 14, opacity: 0 },
                            hover: { x: 0, y: 0, opacity: 1 },
                        }}
                        transition={{ duration: 0.3, ease: heroEase }}
                    >
                        →
                    </motion.span>
                </motion.span>
            </motion.a>
        </motion.div>
    );
}
