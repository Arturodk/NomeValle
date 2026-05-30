## 1. Setup

- [x] 1.1 Install `gsap` and `@gsap/react` dependencies in the `web` project.
- [x] 1.2 Create a global GSAP utility file for `matchMedia` configuration to handle mobile vs desktop animations safely.

## 2. Hero Section Upgrade

- [x] 2.1 Refactor the landing page Hero (`app/page.tsx`) to enforce a wide container (`max-w-5xl`) ensuring the H1 never exceeds 2-3 lines.
- [x] 2.2 Implement cinematic entry animations for the Hero text and background using `@gsap/react` `useGSAP` hook.
- [x] 2.3 Remove all generic meta-labels (e.g., "SECTION 01", "ABOUT US") from the landing page structure to enforce the AIDA layout.

## 3. Bento Grid Implementation

- [x] 3.1 Update `ProductCard.module.css` to include premium hover physics (`transform scale`, long transition durations).
- [x] 3.2 Modify the product catalog grid CSS to use `grid-auto-flow: dense`, creating a gapless bento grid presentation.
- [x] 3.3 Add `ScrollTrigger` animations to the product grid so cards scale up from 0.8 and fade in as they enter the viewport.

## 4. Builder Micro-interactions

- [x] 4.1 Update `PlateBuilder` component to include smooth CSS/GSAP transitions when items are added to or removed from the session queue.
- [x] 4.2 Enhance all interaction buttons in `NomenclatureBuilder` and `PlateBuilder` with high-contrast hover states and scaling physics.
- [x] 4.3 Wrap the main app container with `overflow-x-hidden` to prevent horizontal scrolling issues caused by off-screen GSAP initial states.
