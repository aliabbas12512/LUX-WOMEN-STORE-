# LUX — Saudi Women's Fashion Store (لُكس)

An Arabic-first (RTL) luxury e-commerce storefront for abayas, dresses and modest fashion. It is built for mobile visitors arriving from Snapchat ads.

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS 4 · Lucide icons · optional Supabase for order storage. It is ready to deploy on Vercel.

> **Status:** the code is production-ready, but the **catalogue is SAMPLE data**. The 16 products in `src/data/products.json` are marked `"sample": true`. A notice bar is shown on every page, and those product pages are `noindex` and left out of the sitemap. Replace them with your real, authorised products before launch (see *Catalogue* below).

---

## 1. Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
|---|---|
| `npm run dev` | Local development |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript strict check |
| `npm run catalog:validate` | Validate `src/data/products.json` (`-- --production` fails if sample products remain) |
| `npm run catalog:import -- file.csv [--merge]` | Import authorised products from CSV |
| `npm run catalog:report` | Price / landed cost / margin per product |

## 2. What is included

- **Pages:** home, collections (`abayas`, `dresses`, `everyday`, `occasion`, `new`, `offers`, `all`), product detail, search, favourites, cart, checkout, order confirmation, account (orders on this device), size guide, about, contact, shipping, returns, privacy, terms, 404/error/loading states.
- **Shopping:** colour and size selection with per-variant stock, quantity, slide-in cart, favourites, Arabic-aware search (ignores tashkeel and common أ/ا, ة/ه, ى/ي variants), and filters for size, colour, price and availability, plus sorting. Filters are kept in the URL so they can be shared.
- **Ordering:** `POST /api/orders` re-validates everything on the server. Prices come only from the server-side catalogue. It also validates Saudi mobile numbers (Arabic digits accepted), checks stock, applies the delivery fee by city, and includes a honeypot and a basic rate limit. The order is saved to Supabase and/or a webhook when configured.
- **WhatsApp:** a floating button on every page, a pre-filled product enquiry (product, size, colour, quantity, price and link), and a pre-filled order message after checkout.
- **Snapchat Pixel:** consent-gated. It sends `PAGE_VIEW`, `VIEW_CONTENT`, `ADD_CART`, `START_CHECKOUT`, `ADD_TO_WISHLIST` and `SEARCH`. **`PURCHASE` fires only when the order API confirms the order was saved.** It never fires on a button click alone. `utm_*` and `ScCid` from the landing URL are attached to the stored order for attribution.
- **SEO:** Arabic titles and descriptions, canonical URLs, Open Graph image, `sitemap.xml`, `robots.txt`, web manifest, and Organization and Product JSON-LD (real products only).
- **Accessibility:** native `<dialog>` drawers (focus trap and Esc), labelled controls, a skip link, reduced-motion support, and WCAG AA colour contrast (checked with axe).

## 3. Configuration — what you must set before launch

### Environment variables (`.env.local` locally, Vercel → Settings → Environment Variables in production)

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | e.g. `https://www.yourbrand.sa`. Used for canonical URLs, sitemap and WhatsApp product links |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional | Defaults to the store number `966508202459` (0508202459) set in `src/config/site.ts`; set this only to override it |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | For saved orders | Server-only. Run `supabase/schema.sql` first |
| `ORDER_WEBHOOK_URL`, `ORDER_WEBHOOK_SECRET` | Optional | Also POSTs each order as JSON (Make/Zapier/n8n/Google Sheets). The secret is sent as `X-Order-Secret` |
| `NEXT_PUBLIC_SNAP_PIXEL_ID` | For Snapchat ads | From Snapchat Events Manager |
| `NEXT_PUBLIC_TRACKING_CONSENT_REQUIRED` | — | Default `true` (shows a consent bar). Change it only after a legal review |
| `NEXT_PUBLIC_IMAGE_HOSTS` | When using remote photos | Comma-separated hostnames for product images |
| `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_SNAPCHAT_URL`, `NEXT_PUBLIC_TIKTOK_URL` | Optional | Empty values are simply not shown |

**How orders behave**

| Storage configured? | Result for the customer | Purchase event |
|---|---|---|
| Yes, save succeeds | "Order received" + a reference number | Fired |
| Yes, save fails | Clear error + a "send via WhatsApp" fallback | Not fired |
| No | "Last step: send your order via WhatsApp" (an order request) | Not fired |

No online payment is simulated. No payment gateway is integrated. If you add one (for example Moyasar, Tap or HyperPay), confirm the payment server-side before you store the order or fire `PURCHASE`.

### Business settings (in code)

- `src/config/store.ts`: **delivery fee** (`defaultFee: 30` is a placeholder), optional per-city fees, free-shipping threshold, **delivery estimate** (`null` means "confirmed with the order"), **return window** (7 days by default), who pays return shipping, and cash on delivery. Every value marked `CONFIRM` must be checked.
- `src/config/site.ts`: brand name, tagline, announcement-bar messages, contact hours and location, **legal entity, CR and VAT number** (hidden while empty, so never fill them with unregistered details), and the optional hero campaign photo.
- `src/content/policies.tsx`: shipping, returns, privacy and terms texts. They read the values above. **Have them reviewed** against your operations and Saudi e-commerce and personal-data regulations.
- `src/data/size-guide.ts`: reference charts. Replace them with your supplier's exact measurements.
- `src/data/collections.ts`: collection titles, descriptions and optional campaign images.

## 4. Catalogue & supplier workflow

Products live in `src/data/products.json` and are typed by `src/lib/types.ts`. Stock is tracked per colour and size: a number means units in stock, `0` means sold out, and `null` means availability is confirmed with the supplier when the order is placed (shown as «يُؤكَّد التوفر عند الطلب»).

**Rules (enforced by the import script and the UI):**

1. Use only images and descriptions you have permission to use. Trendyol, SHEIN and other marketplace listings do **not** automatically grant commercial reuse. Images are imported only when `image_rights_confirmed=yes`.
2. `compareAtPrice` is for genuine, running discounts only. The "Offers" section and page appear only when such products exist.
3. Set `bestSeller` only from real sales data.
4. Fill `details` (fabric and care) only when verified, and `deliveryDays` only when confirmed.

**Import:** fill `catalog/products-template.csv` (one row per colour and size) and run:

```bash
npm run catalog:import -- my-products.csv      # replaces the catalogue (use --merge to add/update)
npm run catalog:validate -- --production       # must pass before launch
npm run catalog:report                          # check margins
```

- Supplier cost, currency, SKU and source link go to `catalog/supplier-data.json`. This file is **git-ignored and never bundled into the website**.
- If a row has no `price`, the selling price is calculated from cost using `catalog/pricing.json`: exchange rates (USD is pegged at 3.75; **fill TRY/EUR with your real rate**), target margin, per-item shipping and packaging costs, and price rounding.

Until a product has photos, the site shows a consistent illustrated placeholder in the product's real colour. No copied or stretched images are used.

## 5. Deploy to Vercel

1. Push this repository to GitHub.
2. Go to vercel.com → **Add New → Project** → import the repo. The framework is detected as Next.js, so no build settings are needed.
3. Add the environment variables from section 3 for **Production** (and Preview if you want).
4. Click **Deploy**. Then go to **Settings → Domains** to add your domain, and update `NEXT_PUBLIC_SITE_URL` to match. Redeploy, because `NEXT_PUBLIC_*` values are inlined at build time.
5. Supabase (optional): create a project, open the **SQL Editor**, run `supabase/schema.sql`, and copy the project URL and the **service_role** key into Vercel. Never expose the service-role key in a `NEXT_PUBLIC_` variable.
6. Snapchat: create the Pixel in Ads Manager, set `NEXT_PUBLIC_SNAP_PIXEL_ID`, redeploy, and confirm the events in Events Manager (accept the consent bar first).

## 6. Go-live checklist

- [ ] Real products imported; `npm run catalog:validate -- --production` passes (this also removes the sample notice).
- [ ] Authorised product photos, with `NEXT_PUBLIC_IMAGE_HOSTS` set when they are remote.
- [ ] Delivery fee, delivery estimate, return window and payment method confirmed in `src/config/store.ts`.
- [ ] Policies reviewed; legal entity, CR and VAT filled only with registered details.
- [x] WhatsApp number set (0508202459) — test it from a phone after deploying.
- [ ] Order storage configured (Supabase and/or webhook), with a test order received.
- [ ] Snapchat Pixel events verified; consent behaviour approved.
- [ ] Optional: hero campaign photo (`siteConfig.hero.image`) and category images.

## 7. Project structure

```
src/
  app/                 routes (App Router), API route, sitemap/robots/manifest/OG image
  components/          layout, home, product, collection, checkout, tracking, ui
  config/              site.ts (brand/contact), store.ts (delivery/returns/payment)
  content/             policy texts
  data/                products.json (catalogue), collections, size guide
  i18n/ar.ts           Arabic UI copy (add en.ts with the same shape for English later)
  lib/                 catalogue queries, cart/favourites stores, analytics, validation, WhatsApp
scripts/               catalogue import / validate / margin report
catalog/               CSV template, pricing inputs
supabase/schema.sql    orders table with RLS
```

**Adding English later:** UI strings are centralised in `src/i18n/ar.ts` (typed as `Dictionary`). Add an `en.ts` with the same shape, introduce a `[lang]` route segment, and add `nameEn`/`descriptionEn` fields to products.
