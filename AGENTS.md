# Aiko Agent Guide

Aiko is a static icon browser. `index.html` contains the UI and export logic; it loads SVG symbols from `assets/icons.svg`. There is no package build step.

## Editing and Verification

- Preserve each symbol's `viewBox`, fill, stroke, and related SVG attributes when copying or exporting it. Outline and solid icons use different rendering attributes; do not force one shape onto both.
- Run `node --test tests/svg-export.test.cjs` after export changes. The tests exercise `getSvgCode` from `index.html`.
- Serve the repository over HTTP for browser checks so the sprite fetch works. Verify search, color selection, SVG copying, and SVG/PNG downloads for both an outline and a solid icon when changing those flows.
- Keep icon metadata in `index.html` aligned with the symbol identifiers in `assets/icons.svg`.
