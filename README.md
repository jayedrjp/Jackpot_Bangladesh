# Jackpot Bangladesh — Restaurant Ordering Platform

A Next.js 16 (App Router) + TypeScript + Tailwind + Firebase commerce platform
for Jackpot Bangladesh, built to the project brief.

## What's real vs. placeholder right now

- **Branding**: the actual Jackpot logo (`public/images/branding/`) is wired
  into the Navbar/Footer. No AI-generated Jackpot branding was created.
- **Branch data**: the 3 real branches (Staff Quarter, Konapara, Shonir-Akhra),
  their real phone numbers, and real Google Maps links are in `lib/constants.ts`.
  Street addresses and opening hours are marked "pending confirmation" — pull
  these from each branch's Google Business Profile before launch, don't invent them.
- **Support numbers**: the two real complaint/support numbers are wired into
  the Contact page and footer.
- **Food photography**: every product/category/hero image currently points at
  `lib/utils/placeholderImage.ts`, which pulls a tag-matched stock photo from
  LoremFlickr (not a specific copyrighted photo, not an AI-generated fake
  "Jackpot" photo). **Every one of these must be swapped for the client's real
  food photography** before launch — either hardcode a path under
  `/public/images/products/` or upload through the admin Products form once
  Firebase Storage is connected.
- **Menu data**: `lib/mock/products.ts` has 4 example products with the
  BBQ Burger customization example from the brief. Swap `MOCK_PRODUCTS` for
  `getProducts()` / `getProductBySlug()` etc. once Firestore has real products.

## Getting it running

```bash
npm install
cp .env.example .env.local   # fill in real Firebase project credentials
npm run dev
```

Then in the Firebase console:
1. Enable **Firestore**, **Authentication (Email/Password)**, and **Storage**.
2. Deploy `firestore.rules` and `firestore.indexes.json`
   (`firebase deploy --only firestore`).
3. Create your first admin user in `users/{uid}` with `role: "admin"`, then
   sign in at `/admin/login`.
4. Seed `categories`, `products`, `branches`, and `productOptions` — every
   admin CRUD screen for these already writes to the right collections.

## What's built

**Customer site**: landing page, full menu with category filters, dynamic
category pages, product detail pages with structured data (SEO), the product
customization modal (desktop split-view + validated required options + live
price calc), cart, checkout to real order creation, order tracking by ID+phone,
top selling, offers, branches + branch detail, contact form to Firestore.

**Admin dashboard**: protected by Firebase Auth + role check, dashboard
overview with live-ish revenue/profit stats and a "cost data incomplete"
warning, real-time order table with status updates, product/category/branch/
option/offer CRUD, review moderation, a derived customers view, and an
analytics page with month-over-month comparison and a Recharts revenue chart.

## What's intentionally left as a stub for next iteration

- `/admin/settings` is a placeholder screen.
- Branch-wise analytics breakdown (the query is designed via
  `getOrdersByBranch()` but the admin UI table/chart isn't built yet).
- CSV export of reports.
- Daily aggregated `sales/{YYYY-MM-DD}` documents for faster historical
  reporting (analytics currently queries `orders` directly, fine at low
  volume, should move to aggregation as order volume grows).
- Customer accounts (`/account`) — architecture supports it (orders carry a
  `customerId`), but the page itself isn't built.
- Product image upload UI in the admin Products form (the `uploadImage()`
  helper in `lib/firebase/storage.ts` is ready to wire in).
- Google Reviews import — no public review data was scraped or fabricated;
  wire this up once you decide how to pull it (Places API, manual entry,
  etc.), and always attribute it as "Google Reviews," never as original site
  content, per the brief.

## A note on the reference images

One of the uploaded reference images (`jackpot_wall.png`) was actually a
different restaurant's wall sign ("Welcome to Burger Heaven"), not Jackpot's.
It was excluded from branding entirely — only the real Jackpot logo files
were used.
