"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-display text-3xl">حدث خطأ غير متوقع</h1>
      <p className="mt-3 text-[0.92rem] leading-7 text-muted">نعتذر عن ذلك. يرجى المحاولة مرة أخرى، وإن استمرت المشكلة تواصلي معنا.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>إعادة المحاولة</Button>
        <ButtonLink href="/" variant="outline">
          العودة إلى الرئيسية
        </ButtonLink>
      </div>
    </section>
  );
}
