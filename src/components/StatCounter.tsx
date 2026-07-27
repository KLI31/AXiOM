import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { animate } from "motion";

interface StatCounterProps {
    value: number;
    suffix?: string;
    label: string;
    delay?: number;
}

export default function StatCounter({
    value,
    suffix = "",
    label,
    delay = 0,
}: StatCounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        once: true,
        margin: "-10% 0px -10% 0px",
    });
    const shouldReduceMotion = useReducedMotion();
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!isInView || shouldReduceMotion) return;

        const controls = animate(0, value, {
            duration: 1.5,
            delay: 0.2 + delay,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => setDisplay(Math.round(latest)),
        });

        return () => controls.stop();
    }, [isInView, value, shouldReduceMotion, delay]);

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: shouldReduceMotion ? 1 : 0,
                y: shouldReduceMotion ? 0 : 16,
            }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-2 text-center"
        >
            <span className="text-text text-[clamp(2.25rem,4vw,3.25rem)] leading-none font-medium tracking-[-0.02em] tabular-nums">
                {(shouldReduceMotion ? value : display).toLocaleString("es-ES")}
                {suffix}
            </span>
            <span className="text-text-secondary text-xs leading-snug tracking-wide">
                {label}
            </span>
        </motion.div>
    );
}
