import { useEffect, useRef, useState } from "react";

export interface DropdownOption {
    value: string;
    label: string;
}

interface FilterDropdownProps {
    label: string;
    value: string;
    options: DropdownOption[];
    onChange: (value: string) => void;
    align?: "left" | "right";
    triggerClassName?: string;
}

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            viewBox="0 0 12 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={
                "h-2.5 w-2.5 shrink-0 transition-transform duration-200 " +
                (open ? "-rotate-180" : "")
            }
        >
            <path d="M1 1.5L6 6.5L11 1.5" />
        </svg>
    );
}

export default function FilterDropdown({
    label,
    value,
    options,
    onChange,
    align = "left",
    triggerClassName = "",
}: FilterDropdownProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;

        function handlePointerDown(event: MouseEvent) {
            if (
                rootRef.current &&
                !rootRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const selected = options.find((option) => option.value === value);
    const triggerText =
        selected && selected.value !== ""
            ? label
                ? `${label}: ${selected.label}`
                : selected.label
            : label || (selected?.label ?? "");

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={
                    "focus-visible:outline-stone-900 inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-4 " +
                    (value
                        ? "text-text"
                        : "text-text-secondary hover:text-text") +
                    (triggerClassName ? " " + triggerClassName : "")
                }
            >
                {triggerText}
                <ChevronIcon open={open} />
            </button>

            {open && (
                <ul
                    role="listbox"
                    className={
                        "border-border bg-background absolute z-20 mt-3 w-56 border py-1 " +
                        (align === "right" ? "right-0" : "left-0")
                    }
                >
                    {options.map((option) => (
                        <li key={option.value || "all"}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={option.value === value}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                className={
                                    "hover:bg-surface flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors " +
                                    (option.value === value
                                        ? "text-accent font-medium"
                                        : "text-text-secondary")
                                }
                            >
                                {option.label}
                                {option.value === value && (
                                    <span aria-hidden="true">·</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
