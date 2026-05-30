## Why

The current user interface, while functional, lacks the premium, award-winning aesthetic needed to convey the high quality of the metallic products (nomenclaturas and plates) sold by Nomenclaturas del Valle. Standard default layouts often result in boring, generic designs with empty grid spaces, cramped typography, and static interactions. By implementing "taste" principles (AWWWARDS-level design engineering), we solve this by introducing cinematic motion, perfect bento grids, and dynamic typography. This upgrade will significantly elevate the brand's perception, driving higher engagement and conversions.

## What Changes

- **Cinematic Hero Section**: Replaces the standard hero with a wide, 2-line maximum H1 layout, high-contrast CTAs, and a full-bleed radial background to establish immediate visual impact.
- **GSAP Scroll Animations**: Introduces @gsap/react for scroll-triggered motion, including scaling and fading elements, pinned scrolling sections, and scrub-based text reveals.
- **Gapless Bento Grids**: Upgrades product and feature presentations using strict `grid-flow-dense` logic to eliminate empty grid spaces and create a seamless, high-density layout.
- **Hover Physics & Micro-interactions**: Adds premium micro-interactions (`group-hover:scale-105`, long transitions) to all interactive elements.
- **AIDA Structure Enforcement**: Reorganizes the landing page to strictly follow the Attention, Interest, Desire, Action framework.
- **Label Cleanup**: Removes all generic meta-labels ("SECTION 01", "ABOUT US") in favor of structural and visual storytelling.

## Capabilities

### New Capabilities
- `ui-motion-gsap`: Implements advanced GSAP scroll animations, pinning, and scrubbing effects across the landing page and catalog.
- `bento-grid-system`: Introduces strict CSS bento grids with zero empty space using dense flow for product and feature showcases.

### Modified Capabilities
- `product-catalog`: Modifies the catalog presentation to follow AWWWARDS-level design engineering principles, incorporating gapless bento grids and hover physics.
- `plate-builder`: Upgrades the interactive preview interface to match the new premium aesthetic and micro-interactions.

## Impact

- **Affected Code**: `web/app/page.tsx`, `web/components/Header.tsx`, `web/components/ProductCard.tsx`, `web/components/PlateBuilder.tsx`, `web/components/NomenclatureBuilder.tsx`, and `web/app/globals.css`.
- **Dependencies**: Adds `gsap` and `@gsap/react` to `web/package.json`.
- **Systems**: No database or backend changes required; this is purely a frontend UI/UX upgrade.
