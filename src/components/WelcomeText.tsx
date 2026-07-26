import { motion } from "framer-motion";

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.15,
            staggerChildren: 0.12,
        },
    },
};

const line = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.215, 0.61, 0.355, 1],
        },
    },
};

const highlight = {
    hidden: { backgroundSize: "0% 100%" },
    visible: {
        backgroundSize: "100% 100%",
        transition: {
            duration: 0.7,
            delay: 0.25,
            ease: [0.215, 0.61, 0.355, 1],
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
            ease: [0.215, 0.61, 0.355, 1],
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
            ease: [0.215, 0.61, 0.355, 1],
        },
    },
};

export default function WelcomeText() {
    return (
        <div className="max-w-xl pt-28 pb-20 sm:pt-24 sm:pl-8 lg:pl-16">
            <motion.h1
                variants={container}
                initial="hidden"
                animate="visible"
                className="mt-12 text-[clamp(3.2rem,9vw,6rem)] leading-[1.0] font-medium tracking-[-0.02em] text-stone-950"
            >
                <motion.span className="mb-4 block" variants={line}>
                    Aprendiendo sobre
                </motion.span>
                <motion.span
                    className="mb-4 block w-fit bg-no-repeat"
                    variants={line}
                >
                    <motion.span
                        className="bg-no-repeat"
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
                <motion.span className="block w-2xl" variants={line}>
                    IA y software.
                </motion.span>
            </motion.h1>

            <motion.p
                className="mt-9 max-w-84 text-[15px] leading-relaxed text-stone-600"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
            >
                Un lugar para pensar, construir y compartir ideas con calma.
            </motion.p>

            <motion.a
                href="/articles"
                className="group mt-8 flex w-full max-w-88 items-center justify-between border-b border-stone-950 pb-3 text-sm font-medium text-stone-950 transition-colors outline-none hover:text-stone-600 focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f6f1ec]"
                variants={cta}
                initial="hidden"
                animate="visible"
                transition={{ delay: 1.0 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
            >
                <span>Explorar artículos</span>
                <span
                    aria-hidden="true"
                    className="text-base transition-transform duration-300 group-hover:translate-x-1.5"
                >
                    →
                </span>
            </motion.a>
        </div>
    );
}
