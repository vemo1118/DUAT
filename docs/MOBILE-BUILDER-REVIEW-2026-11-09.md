# Mobile builder visual revision — 9 November 2026

## Changes
- Removed the builder's forced light palette. Workbench, controls, cart and checkout inherit the storefront theme. The artwork's chosen color is independent of the interface theme.
- Simplified text creation to a blank input, four font choices and square/circle shapes. Removed preset slogans/years, decorative frame choices and extra shapes.
- Added sixteen solid color options for both text and background, named in Arabic/English, with a low-contrast hint. Image mode also offers transparent background and original proportions.
- Text preview uses measured lines rendered in the DOM. It does not encode or rasterize a print-sized PNG while typing. Export uses the same line layout/font/colors in a 1000px canvas when adding to cart.
- Image files decode and downsample once, then a 360px preview repaints on animation frames. PNG encoding and high-resolution rendering happen on add-to-cart.
- Builder route bundle fell from about 40.2KB to 18.3KB before compression. This is a code-size comparison, not a guaranteed device speed multiplier.
- Corrected an RTL CSS override that forced every preview font to Cairo 500. Artwork typography now respects its selected font and 700 weight, matching export.
- Cart scrolls items and promo content while retaining total and checkout action; supports short mobile screens, safe-area padding, focus containment, Escape and scroll locking. All quantity controls are 44px.
- Checkout summary appears before the customer form on mobile. Improved transfer-account wrapping and 16px mobile form fields to avoid focus zoom.
- Reduced mobile header height and spacing and moved full navigation to larger screens to prevent logo/action overlap.

## Verification
- Visually inspected actual screenshot files in night/dawn, including 320px and 390px builder, image mode, short cart and checkout.
- Responsive checks at 320/390/768/1440 in both themes before the final typography refinement; final DOM preview checks repeated at 320/390 in both themes.
- PNG source content/alpha checked, including original 2:1 proportions, square conversion and transparent background.
- Isolated signed-upload fixture verified a 1000x1000 text print file, selected background pixels, circle transparency and the actual cart thumbnail.
- Inspected full-size print file and preview. Final header logo/action rectangles do not overlap at 320/390/768/1024/1440.
- Cart footer remains within 320x568 and 320x844 viewports with a usable scroll region.
- 76 tests pass; production build, ESLint error check and whitespace diff check pass.

No product prices, campaign dates or existing order records changed. Screen colors are previews; production color matching still requires a physical print sample. No paid order or customer notification is part of verification.
