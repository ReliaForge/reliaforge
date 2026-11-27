# Theme and accessibility

## Current contract

`docs/.vitepress/config.mts` uses the default VitePress theme and owns navigation, sidebar, search,
metadata, and edit links. `docs/.vitepress/theme/index.ts` extends that theme with `custom.css` and
one frontmatter-driven `home-hero-image` slot for the real console preview. The reviewed brand mark
and console/social preview are PNG assets in `docs/public/` and are covered by the exact binary
allowlist.

## Rules

- Prefer VitePress theme configuration and Markdown before adding a custom Vue component.
- Keep the product preview in the default home layout through the existing `heroPreview`
  frontmatter contract, using a centered full-width typographic hero rising directly above the wide
  console stage. Do not replace the documentation theme with a custom application shell.
- Keep custom CSS token-based through VitePress variables aligned with the v2 console palette (cool
  architectural light `#f8f9fb` / `#007e50` and graphite-neutral dark `#0b0c0e` / `#34d399`).
- Use neutral surfaces, hairline separators, small radii, minimal elevation, and one accessible
  emerald accent. Do not add decorative eyebrows/kickers, pill badges, gradients, glow effects, or
  nested card cages.
- Preserve visible keyboard focus and default semantic headings, links, buttons, and landmarks.
- Give informative images an accessible title/description or alt text; decorative effects must not
  carry meaning.
- Keep English and Chinese home frontmatter structurally aligned, including `heroPreview`, actions,
  and feature order.
- Keep the landing page usable at 320 CSS pixels without page-level horizontal scrolling.
- Respect reduced-motion behavior (`prefers-reduced-motion: reduce`) and name explicit CSS
  transition properties.
- A primary CTA must name its destination or action rather than use vague text.
- Use VitePress built-in locales and the default locale menu on the documentation site. English
  remains unprefixed, Chinese uses `/zh/`, and switching languages must preserve the corresponding
  page without browser-language auto-redirects on docs routes.
- Localize navigation, sidebar, search, outline, edit, pagination, 404, accessibility, and theme
  labels. Emit `en-US` or `zh-CN` on the document root.

## Avoid

- Replacing the documentation theme with a general application shell.
- Pre-heading `ALL CAPS` kickers, `<br>` headline splits, or cramped 50/50 split hero columns.
- Inline styles in Markdown or components.
- Palette values scattered outside `custom.css`.
- Navigation that is available only through hover or pointer input.
- Replacing the reviewed real console capture with fabricated UI artwork.

## Verification

`tests/site.spec.ts` covers primary actions, guide navigation, both locale roots, direct reloads,
corresponding-page language switches, localized theme chrome, desktop layout, and the mobile menu.
Run the browser suite after any theme, navigation, locale, or landing-page change, and visually
inspect light, dark, desktop (opening + scrolled), and mobile renders before finishing.
