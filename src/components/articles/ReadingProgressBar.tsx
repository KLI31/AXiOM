import { useEffect } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useReducedMotion,
} from "motion/react";
import {
    getContentRange,
    getReadingProgress,
    onContentResize,
} from "./scrollTracking";

export default function ReadingProgressBar() {
    const shouldReduceMotion = useReducedMotion();
    const rawProgress = useMotionValue(0);

    const progress = useSpring(rawProgress, {
        stiffness: shouldReduceMotion ? 1000 : 280,
        damping: shouldReduceMotion ? 100 : 32,
        mass: 0.3,
    });

    useEffect(() => {
        let ticking = false;

        function update() {
            ticking = false;
            const range = getContentRange();
            if (!range) return;
            rawProgress.set(getReadingProgress(range, window.scrollY));
        }

        function onScrollOrResize() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        }

        update();
        window.addEventListener("scroll", onScrollOrResize, {
            passive: true,
        });
        window.addEventListener("resize", onScrollOrResize);
        const unsubscribeResize = onContentResize(onScrollOrResize);
        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
            unsubscribeResize();
        };
    }, [rawProgress]);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
        >
            <motion.div
                className="bg-accent h-full origin-left"
                style={{ scaleX: progress }}
            />
        </div>
    );
}
