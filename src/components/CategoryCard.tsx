import { motion, useReducedMotion } from "motion/react";

interface CategoryCardProps {
    image: string;
    category: string;
    title: string;
    description: string;
    href: string;
    index?: number;
}

const cardVariants = {
    rest: {},
    hover: {},
};

const liftVariants = {
    rest: { y: 0 },
    hover: { y: -4 },
};

const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
};

const overlayVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 1 },
};

const categoryVariants = {
    rest: { x: 0 },
    hover: { x: 4 },
};

const arrowOutVariants = {
    rest: { x: 0, y: 0, opacity: 1 },
    hover: { x: 14, y: -14, opacity: 0 },
};

const arrowInVariants = {
    rest: { x: -14, y: 14, opacity: 0 },
    hover: { x: 0, y: 0, opacity: 1 },
};

const easeOut = [0.25, 0.46, 0.45, 0.94] as const;

export default function CategoryCard({
    image,
    category,
    title,
    description,
    href,
    index = 0,
}: CategoryCardProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.4,
                delay: shouldReduceMotion ? 0 : index * 0.08,
            }}
        >
            <motion.a
                href={href}
                variants={cardVariants}
                initial="rest"
                animate="rest"
                whileHover={shouldReduceMotion ? undefined : "hover"}
                className="group hover:border-text flex flex-col overflow-hidden border-b transition-colors"
            >
                <motion.div
                    variants={shouldReduceMotion ? undefined : liftVariants}
                    className="relative aspect-[4/3] overflow-hidden"
                >
                    <motion.div
                        aria-hidden="true"
                        initial={{
                            clipPath: shouldReduceMotion
                                ? "inset(0% 0% 0% 0%)"
                                : "inset(100% 0% 0% 0%)",
                        }}
                        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{
                            duration: shouldReduceMotion ? 0 : 0.9,
                            delay: shouldReduceMotion ? 0 : index * 0.08 + 0.1,
                            ease: easeOut,
                        }}
                        className="absolute inset-0"
                    >
                        <motion.img
                            src={image}
                            alt=""
                            variants={
                                shouldReduceMotion ? undefined : imageVariants
                            }
                            initial={{
                                scale: shouldReduceMotion ? 1 : 1.15,
                            }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{
                                duration: shouldReduceMotion ? 0 : 0.6,
                                delay: shouldReduceMotion
                                    ? 0
                                    : index * 0.08 + 0.1,
                                ease: easeOut,
                            }}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                        />
                    </motion.div>
                    <motion.div
                        aria-hidden="true"
                        variants={
                            shouldReduceMotion ? undefined : overlayVariants
                        }
                        transition={{ duration: 0.4 }}
                        className="from-text/25 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent"
                    />
                </motion.div>

                <div className="flex flex-1 flex-col justify-between px-1 py-6 sm:py-8">
                    <div>
                        <motion.span
                            variants={
                                shouldReduceMotion
                                    ? undefined
                                    : categoryVariants
                            }
                            transition={{ duration: 0.3, ease: easeOut }}
                            className="text-accent mb-3 block text-xs font-medium tracking-widest uppercase"
                        >
                            {category}
                        </motion.span>
                        <h3 className="text-text mb-3 text-lg font-medium">
                            {title}
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <span
                        aria-hidden="true"
                        className="text-text-secondary/60 group-hover:text-text relative mt-6 block h-5 w-5 self-end text-lg"
                    >
                        <motion.span
                            variants={
                                shouldReduceMotion
                                    ? undefined
                                    : arrowOutVariants
                            }
                            transition={{ duration: 0.3, ease: easeOut }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            ↗
                        </motion.span>
                        <motion.span
                            variants={
                                shouldReduceMotion
                                    ? undefined
                                    : arrowInVariants
                            }
                            transition={{ duration: 0.3, ease: easeOut }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            ↗
                        </motion.span>
                    </span>
                </div>
            </motion.a>
        </motion.div>
    );
}
