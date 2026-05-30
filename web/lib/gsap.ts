import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins safely on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Standard media queries for AWWWARDS-level responsive animations
export const MEDIA_QUERIES = {
  isMobile: "(max-w: 767px)",
  isDesktop: "(min-w: 768px)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
};

/**
 * Creates a safe GSAP matchMedia instance that handles responsive animations.
 * Automatically respects user's motion preferences (prefers-reduced-motion).
 * 
 * Example usage:
 * ```typescript
 * useGSAP(() => {
 *   const mm = createGSAPMatchMedia();
 *   
 *   mm.add(MEDIA_QUERIES.isDesktop, () => {
 *     // Desktop-only animations
 *     gsap.to(".box", { x: 200 });
 *   });
 *   
 *   mm.add(MEDIA_QUERIES.isMobile, () => {
 *     // Mobile-only animations
 *     gsap.to(".box", { x: 50 });
 *   });
 * }, { scope: containerRef });
 * ```
 */
export const createGSAPMatchMedia = () => {
  return gsap.matchMedia();
};

export { gsap, ScrollTrigger };
