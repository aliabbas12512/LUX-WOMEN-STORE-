"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/format";

type Props = {
  open: boolean;
  onClose: () => void;
  side: "start" | "end" | "bottom" | "full" | "center";
  label: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Bottom sheets become side sheets from this breakpoint up. */
  desktopSide?: "start" | "end";
};

/** Accessible drawer/modal built on the native <dialog> element (focus trap + Esc for free). */
export function Sheet({ open, onClose, side, label, title, children, className }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={cn("sheet", `sheet-${side}`, className)}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        {title !== undefined ? (
          <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4 md:px-7">
            <div className="font-display text-xl">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="-me-2 grid size-10 place-items-center rounded-full transition hover:bg-beige/70"
              aria-label="إغلاق"
            >
              <X className="size-5" strokeWidth={1.25} />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </dialog>
  );
}
