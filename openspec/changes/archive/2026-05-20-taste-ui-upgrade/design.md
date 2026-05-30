## Context

The current UI in Nomenclaturas del Valle focuses heavily on functional requirements (cart management, product listing, custom plate configuration). While technically sound, it lacks the high-end "taste" required to convey the premium quality of the metallic products. To elevate the brand experience, we are applying AWWWARDS-level design engineering principles: replacing static layouts with cinematic GSAP scroll animations, gapless bento grids, and refined typography.

## Goals / Non-Goals

**Goals:**
- Integrate `@gsap/react` and `gsap/ScrollTrigger` for scroll-driven animations, text scrubbing, and section pinning.
- Restructure the landing page (`app/page.tsx`) to strictly follow the AIDA (Attention, Interest, Desire, Action) framework.
- Eliminate generic meta-labels and adopt a wide, horizontal flow for hero typography (maximum 2-3 lines).
- Upgrade product grids to a mathematically perfect "gapless bento grid" using `grid-auto-flow: dense`.
- Enhance component micro-interactions (e.g., `ProductCard` hover scaling with long transitions).

**Non-Goals:**
- Modifying backend APIs, database schema, or checkout logic.
- Changing the core functional behavior of the `PlateBuilder` (only its visual presentation and transitions will be upgraded).

## Decisions

- **GSAP vs. Framer Motion**: We will use GSAP because it provides superior control for cinematic scroll-linked animations, section pinning, and complex sequential timelines, which are central to the "taste" aesthetic.
- **CSS Grid over JS Masonry**: For the bento grids, we will rely strictly on native CSS Grid (`grid-auto-flow: dense`) via CSS Modules. This ensures the grid is gapless and highly performant without relying on heavy JS layout calculations.
- **Hero Typography Constraints**: We will explicitly use wide container classes (`max-w-5xl` or similar) to ensure the H1 text flows horizontally and never stacks into 4+ lines, preventing the "lazy AI" cramped look.

## Risks / Trade-offs

- **[Risk] Horizontal Overflow from GSAP Animations** 
  → **Mitigation**: Wrap the animated parent containers or the main `<main>` element with `overflow-x-hidden`.
- **[Risk] Mobile Performance Degradation** 
  → **Mitigation**: Utilize `gsap.matchMedia()` to provide simplified, lightweight versions of scroll animations on viewports under 768px.
- **[Risk] Hydration Mismatches with GSAP** 
  → **Mitigation**: Strictly use `@gsap/react`'s `useGSAP` hook which is designed to handle React 18+ strict mode and Next.js hydration safely.
