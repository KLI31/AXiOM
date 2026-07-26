import { motion, useReducedMotion } from "motion/react";

interface CategoryCardProps {
    image: string;
    category: string;
    title: string;
    description: string;
    href: string;
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

const arrowVariants = {
    rest: { x: 0, y: 0 },
    hover: { x: 4, y: -4 },
};

export default function CategoryCard({
    image,
    category,
    title,
    description,
    href,
}: CategoryCardProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={{
                opacity: shouldReduceMotion ? 1 : 0,
                y: shouldReduceMotion ? 0 : 24,
            }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
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
                    <motion.img
                        src={image}
                        alt=""
                        variants={
                            shouldReduceMotion ? undefined : imageVariants
                        }
                        transition={{
                            duration: 0.6,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                    />
                </motion.div>

                <div className="flex flex-1 flex-col justify-between px-1 py-6 sm:py-8">
                    <div>
                        <span className="text-accent mb-3 block text-xs font-medium tracking-widest uppercase">
                            {category}
                        </span>
                        <h3 className="text-text mb-3 text-lg font-medium">
                            {title}
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <motion.span
                        aria-hidden="true"
                        variants={
                            shouldReduceMotion ? undefined : arrowVariants
                        }
                        transition={{
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="text-text-secondary/60 group-hover:text-text mt-6 self-end text-lg"
                    >
                        ↗
                    </motion.span>
                </div>
            </motion.a>
        </motion.div>
    );
}
