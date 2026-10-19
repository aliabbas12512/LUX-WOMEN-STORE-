"use client";

import { Check, AlertCircle } from "lucide-react";
import { useUi } from "@/lib/ui";
import { cn } from "@/lib/format";

export function Toaster() {
  const { toasts } = useUi();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={cn(
            "pointer-events-auto flex animate-fade-up items-center gap-2.5 rounded-full px-5 py-3 text-[0.84rem] shadow-[0_18px_40px_-18px_rgb(15_14_12/0.55)]",
            toast.tone === "error" ? "bg-danger text-white" : "bg-ink text-ivory",
          )}
        >
          {toast.tone === "error" ? <AlertCircle className="size-4" strokeWidth={1.5} /> : <Check className="size-4 text-champagne-soft" strokeWidth={1.5} />}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
