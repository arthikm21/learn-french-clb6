# Bonjour visual-composition refinement

## What was wrong

The previous direction had the right ingredients but no shared composition system. Eight independently positioned shapes, three decorative words, the phrase panel, Écho, and a cheerboard all competed inside one small canvas. Percentage offsets and negative mobile positioning made the artwork feel assembled rather than authored.

The second issue was material hierarchy. Glass appeared on the navigation, phrase panel, decorative tile, play control, boards, and popovers. When everything is glass, nothing feels special. The daily plan repeated the same problem with a white outer card containing several unrelated tinted cards.

The third issue was attention control. A permanent homepage character and a returning-user popover could appear simultaneously. Continuous floating and blinking also made the interface feel restless rather than confident.

## Locked refinement system

- One `1240px` content alignment shared by navigation and page content.
- A deliberate `5 / 7` desktop hero split.
- One bounded `12 × 10` language-stage grid with a shared `12px` gap.
- Six grid-locked shapes instead of eight free-positioned shapes.
- Cool-led color distribution: cobalt and sky dominate; coral and butter are accents.
- One retained decorative glyph (`ou`) at low opacity.
- One deliberate overlap: the phrase glass over the colored mosaic.
- Écho receives a reserved dock inside the grid and is boardless on the standard homepage.
- Glass is limited to navigation, the phrase surface, and contextual cheerboards/popovers.
- The daily plan and path progress share one surface with simple dividers.
- Character copy uses sentence case and restrained typography.

## Motion rules

- Colored tiles enter once over `520ms`, staggered by `35ms`.
- The phrase panel follows at `120ms`; the character follows at `240ms`.
- Tiles do not drift continuously.
- Playing the French phrase briefly pulses only the cobalt and sky tiles.
- Subtle mode uses opacity only. Off and reduced-motion modes remain static.

## Placement and attention rules

- Homepage: one character in the reserved mosaic dock.
- Lesson coaching: one dedicated lesson slot.
- Completion: one result-screen column.
- Temporary encouragement: one dismissible corner surface.
- A temporary cheer is suppressed when a persistent character is already visible.
- A returning learner sees Joie in the homepage dock instead of a second popover.

## Responsive acceptance

- Desktop: phrase and character remain fully inside the bounded stage.
- Tablet: hero stacks; stage stays centered and keeps its grid.
- `390px`: the stage changes to a measured `6 × 10` composition.
- `320px`: the stage becomes taller so the phrase, audio control, and character remain readable.
- No negative character offsets and no horizontal overflow.
- Decorative block text is hidden from assistive technology.
- The learning-path meter exposes real progressbar semantics.

## Verification standard

- Headline → CTA → phrase → daily plan is the visual and reading order.
- Only one visible character is permitted in the first viewport.
- No cheerboard copy is visually scaled below a readable size.
- Interactive controls are at least `44px` high where the refined components introduce them.
- Light, dark, full-motion, subtle-motion, animation-off, reduced-motion, no-blur, and forced-color fallbacks remain defined.
