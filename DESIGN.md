# Design System Document: The Intellectual Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**
This design system moves away from the sterile, "template-driven" look of traditional academic portals. Instead, it adopts a **High-End Editorial** aesthetic—blending the authority of a prestigious scientific journal with the fluid, immersive experience of a modern digital agency. 

We achieve this by breaking the rigid, boxy grid. We use intentional asymmetry, where large typographic displays overlap subtle background transitions, and text-heavy content is treated with the same reverence as art. The goal is to make complex research feel accessible, layered, and intellectually vibrant.

---

## 2. Colors
Our palette is rooted in deep, authoritative tones contrasted with a "living" accent color that represents discovery and energy.

*   **Primary (#00193c):** Deep Navy. Used for the most critical brand moments and high-contrast text.
*   **Secondary (#50606f):** Slate Gray. Provides a neutral, intellectual bridge between the primary navy and the light surfaces.
*   **Tertiary (#001f10):** The "Emerald" core. Used for deep-tonal accents, while its fixed variants (**#78fbb6**) provide the vibrant "spark" for interactive elements.
*   **Surface Hierarchy:** We utilize `surface` (#f8f9fa) through `surface-container-highest` (#e1e3e4) to create architectural depth.

**The "No-Line" Rule**
Traditional 1px borders are strictly prohibited for sectioning. Use background shifts to define boundaries. For instance, a research abstract in a `surface-container-low` box should sit directly on a `surface` background. The change in tone is the boundary.

**The "Glass & Gradient" Rule**
To elevate the "Modern" requirement, use Glassmorphism for floating navigation bars or hovering cards. Use `surface_container_lowest` at 70% opacity with a `backdrop-filter: blur(12px)`. For Hero sections, apply a subtle linear gradient from `primary` (#00193c) to `primary_container` (#002d62) to add "soul" and dimension.

---

## 3. Typography
The system uses a sophisticated pairing to balance UI utility with academic storytelling.

*   **UI & Navigation (Manrope - Sans Serif):** Chosen for its geometric clarity and modern "tech" feel. Use `display-lg` (3.5rem) for hero statements and `label-md` (0.75rem) for metadata.
*   **Academic Content (Newsreader - Serif):** A high-readability serif that evokes the prestige of printed journals. Use `body-lg` (1rem) for publication abstracts and `title-lg` (1.375rem) for article headings.
*   **The Hierarchy of Authority:** Headlines (`headline-lg`) should always be Manrope to feel "Modern," while the content they introduce (`body-lg`) transitions into Newsreader to feel "Trustworthy."

---

## 4. Elevation & Depth
We eschew traditional drop shadows for a more organic, "layered paper" feel.

*   **The Layering Principle:** Stacking is our primary depth tool. A `surface-container-lowest` (#ffffff) card placed on a `surface-container-low` (#f3f4f5) background creates a natural, soft lift.
*   **Ambient Shadows:** If an element must float (e.g., a "Download PDF" modal), use a highly diffused shadow: `box-shadow: 0 20px 40px rgba(25, 28, 29, 0.06)`. The shadow color is derived from `on_surface`, never pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline_variant` at 20% opacity. It should be felt, not seen.
*   **Glassmorphism:** Use semi-transparent `surface_container_lowest` to allow background colors to bleed through, ensuring the UI feels like a single, cohesive ecosystem rather than separate components.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#00193c) with `on_primary` text. Radius: `md` (0.375rem). Use a slight horizontal scale on hover.
*   **Secondary:** `secondary_container` (#d1e1f4) with `on_secondary_container`. No border.
*   **Tertiary/Ghost:** No background. Underline on hover using the `tertiary_fixed` (#78fbb6) color.

### Cards & Publications
*   **No Dividers:** Never use lines to separate list items or cards. Use `spacing.8` (2rem) or `surface_container` shifts.
*   **Publication Item:** Title in `newsreader` (`title-md`), metadata (Year, Journal) in `manrope` (`label-md`). The background should be `surface-container-low` with a `hover:surface-container-high` transition.

### Input Fields
*   **Style:** Minimalist. Use `surface_container_highest` as a subtle background fill. The bottom border is 2px `outline_variant`, turning `primary` on focus.
*   **Error State:** Use `error` (#ba1a1a) for text and `error_container` for a subtle field tint.

### Faculty/Member Chips
*   **Interactive:** Small `md` (0.375rem) rounded chips using `secondary_fixed` (#d4e4f6). These represent research interests or tags and should feel like "tactile labels."

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical white space. Let a title sit 40% from the left to create an editorial "break."
*   **Do** mix the fonts within the same block. A `label-md` (Sans) "Published in" sitting above a `title-lg` (Serif) "Nature Communications" creates instant hierarchy.
*   **Do** use the `xl` (0.75rem) rounding for large containers like Hero images to soften the "Formal" feel into something "Friendly."

### Don't:
*   **Don't** use 1px solid borders to separate sections. It breaks the "Curator" flow.
*   **Don't** use pure black (#000000). Use `on_surface` (#191c1d) for all "black" text to maintain tonal softness.
*   **Don't** crowd the text. In an academic context, white space is a sign of confidence and clarity. Use the `spacing.16` (4rem) for section gaps.
*   **Don't** use standard "Blue" links. Use the vibrant `tertiary_fixed_dim` (#59de9b) for an "Electric" modern touch.