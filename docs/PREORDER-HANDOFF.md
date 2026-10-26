# Current handoff — 2026-10-26 / Astra to 5.6 Sol

## 5.6 Sol release continuation — 2026-10-26 22:30 Cairo
- Reviewed and continued the same `/Users/admin/Documents/WORK/DUAT` worktree. No earlier edits were discarded.
- Completed server-confirmed admin saves for social, bundle, sticker and category settings. The UI now reports success only after Supabase returns the saved/deleted row; the social tile modal stays open on failure.
- Removed remaining unsupported launch claims from visible fallback content: 1-year warranty, 14-day returns, 1,000 delivered orders, and unconditional secure/fast-shipping language. Replaced them with verifiable price, size, design and timing facts.
- Expired/draft custom drops no longer keep advertising EGP45 or 4=180. The price and minimum render only while the fixed campaign is open.
- Verified `store_settings` writes are admin-only; `pending_uploads` is service-role-only; `order-designs` and `payment-proofs` are private buckets with image MIME and size limits.
- Activated one fixed seven-day campaign window in `src/domain/preorderWindow.js`. The storefront's `Africa/Cairo` formatter shows booking closing 2026-11-02 at 21:30; production starts at close, followed by the agreed 3–5 day production/shipping window.
- Final local verification after activation: 63/63 tests pass, production build passes, ESLint has zero errors (legacy warnings only), and `git diff --check` passes.
- Next release steps: commit to a preview branch, verify the Vercel preview including live quote/upload without creating a real order or Telegram message, fast-forward `main`, verify the public aliases and deep links.

This section supersedes conflicting earlier notes below. User explicitly requested stopping at the model handoff to save quota. Do not redo research or replace the checkout architecture.

## Verified targets and authority
- Worktree: `/Users/admin/Documents/WORK/DUAT` (not the ChatGPT mirror). All current edits are uncommitted; preserve them.
- Origin: `https://github.com/vemo1118/DUAT.git`. Local HEAD and fetched origin/main: `e27b172853208d46fef37c650412635fc58ae1da`.
- Vercel MCP verified that the live production deployment `dpl_JDBm9Fce5MNDViyeQJTLgBcfSrJv` has that SAME SHA. Existing project `prj_pCdBbGLeNuXxKhrseNjkBH40BL54`, team `team_zknZbJGcphGN02ZGPegq7wm3`, site `https://duat-six.vercel.app`. Other existing aliases: `duat-vemo1118s-projects.vercel.app`, `duat-git-main-vemo1118s-projects.vercel.app`.
- Supabase MCP verified DUAT project `pgqgmrfvsvrvbddafrcf`, ACTIVE_HEALTHY. Read-only count: 77 products, 3 hero_slides. No cloud records changed in this pass.
- User explicitly authorized updating and publishing this existing site and making it usable on other devices. No extra generic publishing permission needed.
- User approved 7 days of booking, then 3–5 days for manufacturing and shipping. This supersedes November 5. Do not invent a different timeline or a crossed-out reference price.

## Implemented this pass
- Builder defaults to image mode, ivory base, no border, original-ratio frame. Light workbench independent of global theme, clickable upload-first empty state. Black bases remain selectable.
- Image PNG/JPEG/WebP validation, 5MB limit, decoded pixel dimensions. `src/domain/stickerArtwork.js` preserves proportions, default maximum dimension 25mm (batch reference); round frames use an inscribed safe box, scale limited to 50–100%, narrow-image warning. Preview AND uploaded order image use the same rendered PNG, including selected background/border/frame. Previous bug uploaded raw unframed image. No customer batch photos published.
- Physical width/height, frame, border and scale now flow from builder through compactCartItems into server-normalized order metadata. Text uses existing fixed-size exporter; displayed physical dimensions now match aspect ratio rather than character count.
- Builder shows custom quantity progress toward 4; normal price45, minimum4, existing stock60 or50 from4 unchanged.
- Home restores original HeroSlider above the dedicated pre-order hero; hero data was never deleted. Added dismissible native-dialog pre-order welcome, once per session/campaign, only while booking open. No forced email/phone capture, no fake scarcity. 4=180 before shipping and additional45 each explicit.
- Fixed product/hero save functions that previously swallowed database errors or relied on assigning variables inside deferred React updaters. Cloud write and returned row confirmation now precede local UI updates. Modal waits and stays open on failure; submit locked while pending. Product sorting now stored as sortOrder in cloud JSON. Cloud products no longer overlaid with stale device-only edits or resurrected defaults on a successful fetch.
- Added `preorderSchedule.js` and release script `scripts/open-preorder.mjs`: explicit ISO opening time with timezone -> fixed7-day booking; production starts at close; shipping window close+3 to close+5 days. Policy imports `preorderWindow.js`, currently NULL/DRAFT intentionally until release. Checkout shows duration and Cairo timestamps when set. DO NOT run activation per visitor/rebuild.

## Verification completed
- `npm test`: 63 passing across7 files, including aspect ratio/physical sizes and fixed booking boundaries. API tests isolate notifications/database and mock the draft campaign, independent of eventual real release dates.
- `npm run build`: PASS.
- Focused ESLint `--quiet` on new scripts/domain/builder/admin contexts/modals: no errors (legacy unused-variable warnings remain).
- `git diff --check`: PASS.
- No visual verification of THIS new builder pass yet. Old localhost5174 server is stopped. Safari is showing user's Netflix; do not navigate that tab away. Open a dedicated tab if using Safari.
- No live paid order, proof upload, admin cross-device write, commit, push, or deployment performed. Do not imply otherwise.

## Sol next steps (continue, do not restart)
1. Start local preview; inspect Arabic/English desktop AND mobile: upload empty state, landscape/portrait/square, circle/oval, black/ivory, text, quantity progress. Use generic brand butterfly from mirror `output/DUAT-Batch-100-Review-2026-10-18/Brand-Art/Butterfly-Selected-Original.png` as local visual reference if useful; do not publish private customer batch art. Verify canvas PNG renders and remains identical to cart/order thumbnail. Plain Vite lacks `/api/*`.
2. Check welcome dialog focus/Escape/close/reopen frequency in an isolated open-policy preview; currently hidden because policy is draft. Check inactive/expired campaign copy and booking CTA; static hero currently still describes offer even after closing, while server correctly blocks checkout. Update end-of-campaign messaging before release.
3. Verify admin cloud persistence with authenticated access on two independent browser sessions; products and hero CRUD/sorting code fixed, but remaining category/settings/social providers and reset flows still need review for local-only claims. Do not weaken RLS or expose service keys. Hero fetch currently uses local fallback on an empty result; inspect all-hidden/empty behavior. Do not discard unpersisted historical edits silently.
4. Review checkout end-to-end in a Vercel-compatible environment: design signed upload, four distinct customs, more copies, mixed stock/custom, pricing quote, delivery fees, payment instructions, proof, idempotency, pending-payment status. No real charge or customer message needed. If test records would send Telegram, isolate/mock notifications or explicitly use approved disposable test setup. Existing tests do not establish live service readiness.
5. Verify payment configuration, routes and environment availability without printing secrets. No Supabase schema mutation has been made. Do not run unrelated `scripts/migrate_legacy_base64_orders.js --apply`.
6. When deployment is ready, set ONE explicit opening timestamp near actual release via `node scripts/open-preorder.mjs '<ISO timestamp with timezone>'`. User already approved timeline; derive closing+7 days and shipping+3..5. Re-run tests/build. Ensure campaign activation is committed/deployed to BOTH frontend and API. Do not ask for dates again unless actual delivery meaning is unclear.
7. Review full accumulated diff and deploy to the EXISTING Vercel project/aliases. Prefer authenticated Vercel MCP; Git push may trigger automatic production deploy, so review and test before pushing. CLI was not installed. MCP supports create_deployment using gitSource or uploaded file SHA1; never read/extract credential files. Prefer staged production build + verify + promote when available. Keep Git and deployed source consistent, do not publish only a disposable detached copy.
8. Verify existing site links and deep-link refresh on fresh device/session; check assets, pricing, builder image upload, API quote and order storage. Give user the actual public URL and clear verified/remaining facts.

---
# Earlier history (superseded where different)

# DUAT pre-order foundation — 2026-10-26

## Start here when continuing with GPT-5.6

The core pricing and checkout protection milestone is complete locally. Continue with the landing page, copy, and customer journey. Do not repeat the architecture/research pass or replace existing changes. This is NOT a deployed or launch-ready storefront yet.

Repository: `/Users/admin/Documents/WORK/DUAT`, baseline `e27b172`. Changes are uncommitted. The ChatGPT project mirror and its `sources/` are reference material, not this application. Leave the existing migration script alone, including any unsaved editor changes.

## Latest user decisions (override older research and conversation proposals)

| Purchase | Current rule |
| --- | --- |
| Ready-made individual stock stickers | EGP60 each below four stock units |
| Four or more stock stickers together | EGP50 per stock unit; four = EGP200 |
| Custom launch pre-order | EGP45 per unit; minimum four custom units per order |
| Custom quantities | Four = 180, five = 225, six = 270, eight = 360; each can have a different design |
| Mixed orders | Count the two pools independently; four stock + four custom = EGP380 before delivery |
| Future custom price | User mentioned 80 OR 90; not decided. No invented crossed-out price |
| Production start | November 5, 2026; this is NOT a shipment or delivery date |
| Booking period | One week intended; exact opening/closing timestamps still unset |

Interpretation implemented: stock quantity discount applies to 4+, across `stickers`, `letters`, and `badges`. Existing prebuilt products in category `bundles` retain their catalogue prices and do not count as individual stock pieces. These old bundle offers need reconciliation before launch (see below).

Payment recommendation implemented: full prepayment via existing InstaPay for orders containing custom pieces. Stock-only checkout retains COD/InstaPay. This is a selected approach under the user's request to choose a funding method, not evidence of a live payment gateway. Screenshot upload means transfer awaiting manual verification, not money received.

## Implementation

- `src/domain/commerce.js`: shared pricing, quantity limits, booking state, checkout rules, Arabic/English messages and storefront price projection.
- `api/_lib/order-service.js`: validates product identity/activity from trusted catalogue data, applies shared prices, enforces integer quantities and custom minimum, gates checkout. Custom lines store purchase type and fulfillment-date snapshots.
- `api/create-order.js`: always requests checkout validation; checks expected total against the newly computed server total before uploads/order insertion. Existing idempotent retry remains.
- `api/quote-order.js`: returns custom quantities and booking issue without blocking design previews.
- `src/context/CartContext.jsx`: reprices on every quantity change; separates the two pools; clears stale coupon results after cart edits.
- `src/context/ProductsContext.jsx`: projects stock storefront prices at 60 and removes old struck-through anchors. `catalogProducts` preserves raw data for `AdminView`; changing an admin catalogue stock price does not override the shared stock pricing policy.
- `src/views/StickerBuilderView.jsx`: EGP45, copies-per-design label, minimum-four explanation, stays in builder after adding, corrected toast API.
- `src/components/CartDrawer.jsx`: correct stock threshold, custom progress/booking messages, link to design another piece, blocks custom WhatsApp checkout bypass.
- `src/views/CheckoutView.jsx`: fetches server quote before allowing submission/payment instructions, refreshes before submission, sends expected total, forces custom prepayment, shows transfer under review. Quote retry preserves in-memory cart. Correct item keys and stock/custom edit routing.
- `src/services/orderApi.js`: rejects malformed/non-API responses instead of treating an HTML fallback as success.

Custom coupons do not stack on the launch price. Existing coupons apply only to the non-custom subtotal, including stock tiers. This is a conservative implementation choice to preserve the EGP45 offer; confirm/change it if marketing asks for additional discounts. Existing free-shipping threshold of EGP800 remains; it was not newly agreed in this conversation.

## Launch switch is deliberately closed

`PREORDER.opensAt`, `closesAt`, and `shipsBy` are null. Therefore custom designs can be quoted, but custom order creation is rejected by the server. Do not remove this validation just to get a success screen.

Before activating, obtain exact booking timestamps and a realistic dispatch commitment after production starts. Use explicit UTC offsets for timestamps (Cairo's offset can change during this period). Test values in `commerce.test.js`, including November 15, are fixtures, NOT promised dates. Then set the shared policy and update tests that currently assert the draft state. The server clock is authoritative; client countdowns are presentation only.

## Validation and its limits

On October 26 after the final changes:

- `npm test`: 55 tests across six files passed. Covers tier boundaries and reversal, independent mixed carts, custom designs, invalid quantities, trusted price/category, inactive products, coupon separation, date boundaries, draft checkout rejection and prepayment rule.
- `checkoutApi.test.js` exercises the real quote/create handlers and quote service with isolated database/notification adapters: confirms total mismatch and booking rejection happen before insertion; confirms stock totals and duplicate retries. No live order, upload, or notification occurs in these tests.
- `npm run build`: passed.
- `npm run lint`: zero errors; existing unused-code warnings remain.
- `git diff --check`: passed.
- Earlier browser check in this same work session verified stock cart 1=60, 3=180, 4=200, back to 3=180, and builder EGP45/minimum-four copy.

Full browser-to-server-to-storage checkout has NOT been verified. The earlier Vite process on port5174 is no longer reachable at handoff; plain Vite does not run the Vercel API handlers. Use a correctly configured local API runtime or an isolated preview/test environment for full flow verification. Do not create production orders, upload proof to production, run migrations, or send actual notifications as an incidental test. No deployment or database migration was performed.

## Remaining work suited to GPT-5.6

1. Make the custom pre-order the landing page's primary offer: EGP45 each, four from EGP180 before delivery, independently customized, more pieces allowed. Ready-made stock is secondary. Match Arabic/mobile layout and English behavior.
2. Trace actual hero/content providers before editing: `HeroBannersContext` and stored/cloud content can override initial constants. Updating a static hero array alone may not change the visible page.
3. Reconcile legacy prebuilt bundle prices/offers with the 60/50 stock policy. Old 6-pack450/trio250 and related savings claims are not part of the approved new offer. Do not silently invent a new discount schedule or remove products from live storage.
4. Audit remaining banners and product copy: old shipping timelines, countdowns, return policy, reviews/sales counts and material claims need real support. Do not promise delivery on November5 or fabricate scarcity/social proof. No generic 80/90 old-price anchor until decided.
5. Finish quantity/design UX and browser verification: four distinct designs, copies of a design, removal below four, mixed stock/custom, quote failure/retry, payment selection, and mobile cart. The existing API limits are 24 lines and 20 units per line; these are technical caps, not bundle multiples. UI should explain/prevent exceeding them rather than leaving an unsubmitable cart. Cart remains in memory and is lost on reload; persistent carts are not implemented.
6. Confirm dates and dispatch promise, then activate policy. Verify open/closed UI and server enforcement in the appropriate test environment. Existing manual payment review workflow must remain clear; do not label uploaded proof as verified payment.
7. Complete browser/API/upload/order verification using isolated test data, inspect final diff, and prepare a concrete deployment review. Do not describe passing unit tests as a live paid-order success.

Suggested next instruction: "Read docs/PREORDER-HANDOFF.md and the current diff, then implement the pre-order landing page and customer journey around the established pricing. Preserve server validation and clearly list remaining launch decisions."

## GPT-5.6 landing implementation update

### Brand identity implementation

Applied the supplied `sources/duat-brand-guidelines.html` identity: Anton for Latin display/wordmark, Space Grotesk for Latin body, Cairo for Arabic UI; Twilight/Indigo/Bone-dim palette; rising-disc proportions (120 viewBox, 26 radius, horizon at74); and matching favicon. The wordmark retains Anton in RTL. Shortened hero copy and reduced heading size so the offer and CTA fit sooner. Updated page description to stickers and matched the initial theme to the existing night default.

Desktop English and Arabic were visually checked in Safari after refresh. Build and all56 tests passed. Mobile viewport and full checkout verification remain outstanding; no deployment was performed. Product imagery is retained, not regenerated or certified against new campaign assets.

The remaining storefront work was continued in the same worktree:

- Added a fixed bilingual pre-order hero that cannot be replaced by stale cloud hero content. It leads with EGP45 per custom piece, four pieces = EGP180 before shipping, supports different designs, and keeps ready-made stock secondary.
- Replaced the announcement and trust bars with the approved price, minimum, customization and November5 production-start facts. Removed 3–5 day shipping, 14-day return and one-year warranty claims from the launch journey.
- Added a two-choice price explanation, three-step customization path and focused pre-order FAQ. Removed the old bundle and category promotion from the home page.
- Hid the unapproved legacy bundle offers from the customer-facing product projection while preserving their raw catalogue/admin records. `/bundles` redirects to `/stickers`; bundle navigation was removed. Re-enable only after a new bundle schedule is agreed.
- Ready-made product cards now show EGP60 and a neutral catalogue label without invented 5.0 ratings. Product detail no longer invents a comparison price, dispatch promise, warranty or verified review; reviews render only when supplied.
- Verified both Arabic RTL and English hero states in Safari. The visible Arabic catalogue cards showed EGP60 and neutral labels. The latest automated run passed 56 tests, production build and focused lint with no errors.

Still blocked on business input: exact one-week opening and closing timestamps and an honest dispatch/collection promise after production starts. `PREORDER` remains fail-closed, so custom payment cannot be submitted yet. A full API/storage payment-proof flow still requires an isolated Vercel-compatible test environment; plain Vite serves the visual frontend only.
