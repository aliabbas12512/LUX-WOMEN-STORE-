"use client";

import Link from "next/link";
import { CONSENT_REQUIRED, SNAP_PIXEL_ID, setConsent, useConsent } from "@/lib/analytics";
import { useHydrated } from "@/lib/store";

/** Slim, non-blocking consent bar — only shown when a tracking pixel is configured. */
export function ConsentBar() {
  const consent = useConsent();
  const hydrated = useHydrated();
  if (!hydrated || !SNAP_PIXEL_ID || !CONSENT_REQUIRED || consent !== null) return null;

  return (
    <div
      role="region"
      aria-label="إعدادات ملفات تعريف الارتباط"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl animate-fade-up rounded-2xl border border-line bg-ivory/95 p-4 shadow-[0_18px_50px_-20px_rgb(15_14_12/0.35)] backdrop-blur md:bottom-6"
    >
      <p className="text-[0.82rem] leading-6 text-muted">
        نستخدم ملفات تعريف الارتباط لقياس أداء إعلاناتنا وتحسين تجربتكِ. يمكنكِ القبول أو الرفض في أي وقت.{" "}
        <Link href="/privacy" className="text-ink underline underline-offset-4">
          سياسة الخصوصية
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setConsent("granted")}
          className="h-10 flex-1 rounded-full bg-ink text-[0.82rem] text-ivory transition hover:bg-ink-2"
        >
          موافقة
        </button>
        <button
          type="button"
          onClick={() => setConsent("denied")}
          className="h-10 flex-1 rounded-full border border-ink/20 text-[0.82rem] transition hover:border-ink"
        >
          رفض
        </button>
      </div>
    </div>
  );
}
