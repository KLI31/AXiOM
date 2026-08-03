export const NAV_OFFSET = 128;

export interface ContentRange {
    start: number;
    end: number;
}

/**
 * Absolute (document-relative) start/end of [data-article-content],
 * so measurements stay stable as the user scrolls past the element.
 */
export function getContentRange(): ContentRange | null {
    const content = document.querySelector<HTMLElement>(
        "[data-article-content]"
    );
    if (!content) return null;

    const rect = content.getBoundingClientRect();
    const start = rect.top + window.scrollY;
    const end = rect.bottom + window.scrollY;
    return { start, end };
}

/**
 * Fraction of [data-article-content] read, in [0, 1]. 0% at scrollY = start,
 * 100% at scrollY = end, independent of viewport height — this keeps 100%
 * tied to "the user has scrolled through the whole article" rather than
 * "the whole article fits on screen", so it stays in sync with the last
 * TOC heading being active even when the content isn't much taller than
 * the viewport. Guards against a degenerate (zero-height) range.
 */
export function getReadingProgress(
    range: ContentRange,
    scrollY: number
): number {
    const { start, end } = range;
    const scrollableDistance = end - start;

    if (scrollableDistance <= 0) {
        return scrollY >= start ? 1 : 0;
    }

    return Math.min(Math.max((scrollY - start) / scrollableDistance, 0), 1);
}

/**
 * Id of the heading whose section the user is currently reading, using the
 * same NAV_OFFSET-based threshold TableOfContents has always used.
 */
export function getActiveHeadingId(
    headings: HTMLElement[],
    navOffset: number = NAV_OFFSET
): string {
    if (!headings.length) return "";

    const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

    if (atBottom) {
        return headings[headings.length - 1].id;
    }

    let current = headings[0].id;
    for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= navOffset + 4) {
            current = heading.id;
        } else {
            break;
        }
    }
    return current;
}

const resizeListeners = new Set<() => void>();
let sharedResizeObserver: ResizeObserver | null = null;

/**
 * Subscribes to layout-height changes of [data-article-content] (e.g. the
 * mobile TOC panel opening, or images finishing loading) via a single
 * shared ResizeObserver, instead of one per consumer. Returns an
 * unsubscribe function.
 */
export function onContentResize(callback: () => void): () => void {
    if (!sharedResizeObserver) {
        sharedResizeObserver = new ResizeObserver(() => {
            for (const listener of resizeListeners) listener();
        });
        const content = document.querySelector<HTMLElement>(
            "[data-article-content]"
        );
        if (content) sharedResizeObserver.observe(content);
    }

    resizeListeners.add(callback);

    return () => {
        resizeListeners.delete(callback);
        if (resizeListeners.size === 0 && sharedResizeObserver) {
            sharedResizeObserver.disconnect();
            sharedResizeObserver = null;
        }
    };
}
