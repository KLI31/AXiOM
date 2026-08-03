import PaperDot from "@/components/PaperDot";

// Same halftone-dust trick as the page header: a synthetic corner gradient
// (not a photo) drives the shader, so this thumbnail reads as pure brand
// texture — used for the article that has no representative photograph.
const dustGradient = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#ffffff"/>' +
        '<stop offset="45%" stop-color="#ffffff"/>' +
        '<stop offset="100%" stop-color="#000000"/>' +
        "</linearGradient></defs>" +
        '<rect width="10" height="10" fill="url(#g)"/></svg>'
)}`;

export default function DustThumbnail() {
    return (
        <div className="h-full w-full">
            <PaperDot
                imageUrl={dustGradient}
                colorBack="#f6f3ed"
                fit="cover"
            />
        </div>
    );
}
