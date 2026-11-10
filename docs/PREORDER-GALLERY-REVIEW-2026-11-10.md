# Pre-order gallery review — 2026-11-10

The cloud `preorder_hero_settings.imageUrl` already contains the merchant's new
Cloudinary image `v1794307904/1_lavxzo.jpg`. A direct image request returned 200.
The first live browser pass found images still loading after switching; waiting
for decoding allowed all four images and returning to 01 to render. A permanent
wrong-URL problem was not reproduced in a fresh browser session.

Changes:
- Keep each visited gallery image mounted, so returning to 01 retains its loaded
  element rather than changing one image source repeatedly during pending loads.
- Fixed square preview frame; contain each image without cropping.
- Explicit loading, failure and retry states instead of an unexplained blank frame.
- Restart at 01 when the actual cloud gallery URLs change; unrelated text edits
  do not reset selection. Wait for cloud settings before rendering gallery images.
- Preserve unsaved dashboard drafts during background settings refreshes.
- Discard pre-save reads that finish after a save; success requires a returned
  cloud row. Image uploads still use immutable content-addressed store assets.

Verification:
- Existing 89 tests pass; production build and quiet ESLint pass.
- Browser fixture verifies dirty draft protection, confirmed image save, an open
  storefront refreshing to the new first image, and visible failed-save feedback.
  All fixture writes were intercepted; production image settings were preserved.
- Browser network failure fixture verifies a failed image shows an error and an
  explicit retry decodes and renders the image successfully.
- Real cloud image navigation checked at 320, 390 and 1440 CSS pixels, including
  01 → 02 → 03 → 04 → 01 → 03 → 01, Arabic and English, no horizontal overflow.
