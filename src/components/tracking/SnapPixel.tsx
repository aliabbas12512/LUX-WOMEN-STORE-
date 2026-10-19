"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { CONSENT_REQUIRED, SNAP_PIXEL_ID, flushPending, track, useConsent } from "@/lib/analytics";

/** Loads the Snapchat Pixel only when configured and (if required) consented to. */
export function SnapPixel() {
  const consent = useConsent();
  const allowed = !!SNAP_PIXEL_ID && (!CONSENT_REQUIRED || consent === "granted");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ready = useRef(false);

  useEffect(() => {
    if (!allowed || !ready.current) return;
    track("PAGE_VIEW");
  }, [allowed, pathname, searchParams]);

  if (!allowed) return null;

  return (
    <Script
      id="snap-pixel"
      strategy="afterInteractive"
      onReady={() => {
        if (ready.current) return;
        ready.current = true;
        track("PAGE_VIEW");
        flushPending();
      }}
    >{`
(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');
snaptr('init', ${JSON.stringify(SNAP_PIXEL_ID)}, {});
`}</Script>
  );
}
