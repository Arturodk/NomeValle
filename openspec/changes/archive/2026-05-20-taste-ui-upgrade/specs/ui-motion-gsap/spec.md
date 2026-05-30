## ADDED Requirements

### Requirement: GSAP scroll animations
The system SHALL use GSAP (`@gsap/react` and `ScrollTrigger`) to animate major page sections on scroll. Elements MUST scale up and fade in as they enter the viewport.

#### Scenario: Element enters viewport
- **WHEN** the user scrolls down and an animated element enters the viewport
- **THEN** the element fades in from opacity 0 to 1 and scales from 0.8 to 1.0 smoothly

### Requirement: AIDA structure enforcement
The landing page SHALL visually follow the AIDA framework, displaying a wide cinematic Hero (Attention), a high-density grid (Interest), scroll-animated sections (Desire), and a massive CTA footer (Action). Meta-labels (e.g. "SECTION 01") MUST NOT be used.

#### Scenario: User visits landing page
- **WHEN** the landing page loads
- **THEN** the Hero section displays the H1 in a maximum of 2-3 lines with cinematic motion, and no generic meta-labels are visible
