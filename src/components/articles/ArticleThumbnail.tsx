import DustThumbnail from "@/components/articles/DustThumbnail";
import type { Article } from "@/data/articles";

interface ArticleThumbnailProps {
    article: Article;
    className?: string;
}

export default function ArticleThumbnail({
    article,
    className = "",
}: ArticleThumbnailProps) {
    if (article.image === "__dust__") {
        return (
            <div className={className}>
                <DustThumbnail />
            </div>
        );
    }

    return (
        <div className={`overflow-hidden ${className}`}>
            <img
                src={article.image}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
        </div>
    );
}
