import { useEffect, useRef, useState } from "react";
import { HalftoneDots } from "@paper-design/shaders-react";

interface PaperDotProps {
    imageUrl?: string;
    fit?: "none" | "contain" | "cover";
    scale?: number;
    colorBack?: string;
}

const PaperDot = ({
    imageUrl = "/hands-clean.jpg",
    fit = "cover",
    scale = 1.04,
    colorBack = "#f6f1ec",
}: PaperDotProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 1280, height: 720 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(([entry]) => {
            if (!entry) return;

            setSize({
                width: Math.round(entry.contentRect.width),
                height: Math.round(entry.contentRect.height),
            });
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="h-full w-full overflow-hidden">
            <HalftoneDots
                width={size.width}
                height={size.height}
                image={imageUrl}
                colorBack={colorBack}
                colorFront="#211e1a"
                originalColors={false}
                type="classic"
                grid="hex"
                inverted={false}
                size={0.1}
                radius={1.01}
                contrast={0.45}
                grainMixer={0.34}
                grainOverlay={0.03}
                grainSize={0.5}
                scale={scale}
                fit={fit}
            />
        </div>
    );
};

export default PaperDot;
