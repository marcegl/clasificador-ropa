# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server (http://localhost:5173, base "/")
npm run build    # tsc -b && vite build  → dist/  (base "/clasificador-ropa/")
npm run preview  # serve a prior build
npm run lint     # tsc -b --noEmit (type-check only)
```

There is no test runner configured — do not invent test commands. `npm run build` is the
gate: TypeScript runs with `strict`, `noUnusedLocals`, and `noUnusedParameters`, so an unused
variable/import/param fails the build. Always run `npm run build` after changes.

`tsc -b` is a composite build (via `tsconfig.node.json`); it emits `vite.config.js`,
`vite.config.d.ts`, and `*.tsbuildinfo` at the repo root. These are generated artifacts, not
source — ignore them and never edit them.

## Big picture

Static SPA (Vite + React + TypeScript), no backend. All state lives in `localStorage` under
`clasificador-ropa:v1` (`{ washerId, garments }`). UI copy is entirely in **Spanish** (Rioplatense
"vos") — keep new strings in Spanish.

The product helps the user sort a laundry pile into compatible **loads** ("tandas") and pick the
right wash program. The interesting logic is the domain model + classification engine, not the UI.

### Data / engine (read these together)

- `src/lib/types.ts` — domain types. `Garment`, `WasherProfile`/`WasherProgram`, and the
  computed `WashLoad`.
- `src/data/washers.ts` — **the parameterization point.** Each `WasherProfile` is an editable
  list of programs (`fabrics`, temps, `maxSpinRpm`, `canDry`). The LG `WD12VVC4S6C` is the
  reference default (`DEFAULT_WASHER_ID`). The classifier only ever recommends programs that
  exist in the selected profile. Adding a profile to `WASHERS` makes it appear in the picker
  automatically (see README "Lavarropas y parametrización").
- `src/data/garments.ts` — `GARMENT_CATALOG` drives the add-clothes flow. The user picks a
  **garment**, and its **fabric is inferred** from the catalog item. The user only supplies what
  cannot be inferred: color, soil, quantity, `isNew`. Also holds `COLOR_*` maps and
  `COLOR_GUIDE`.
- `src/lib/classifier.ts` — the engine. `classify(garments, washer)` groups garments by a
  composite key: **`FABRIC_FAMILY` × `COLOR_BUCKET` × first-wash flag**.
  - `FABRIC_FAMILY` maps each `Fabric` → wash `Family` (resistente/sintetico/jean/…).
  - `COLOR_BUCKET` collapses the 5 `ColorGroup`s into 4 buckets (BLANCOS, CLAROS, COLOR,
    OSCUROS) — this is the explicit color-separation rule.
  - `needsFirstWash` isolates **new** colored/dark garments into their own "Primer lavado"
    load so they cannot bleed onto the rest.
  - `pickProgram` selects the best available program by fabric overlap; `recommendTemp` /
    spin derive temperature and centrifuge from color bucket, soil, and family.
  - Output loads are sorted blancos → claros → color → oscuros, with first-wash loads last.

When changing classification behavior, the change almost always belongs in `classifier.ts`
and/or the data maps in `garments.ts`/`washers.ts`, not in components.

### UI

`src/App.tsx` orchestrates a 4-step flow: `WasherPicker` (1) → `GarmentCatalog` (2, includes
the inline configurator) → `ColadaList` (3) → `Results` (4). Pure presentational components in
`src/components/`. Deliberate product decisions to preserve:

- The color guide is an **interaction inside `Results`** ("¿Cómo agrupé tu ropa?"), not a
  standalone card.
- The add flow is **garment-first**; the fabric selector is intentionally hidden behind an
  "Ajustes" disclosure, not shown by default.

Styling is a single `src/styles.css` driven by CSS variables in `:root` (theme is deliberate:
Fraunces + Hanken Grotesk loaded in `index.html`). To re-theme, change the variables, not the
rules.

## Deployment (coupling to watch)

Pushing to `main` auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`. Repo:
`github.com/marcegl/clasificador-ropa`, live at `https://marcegl.github.io/clasificador-ropa/`.

`vite.config.ts` sets `base: '/clasificador-ropa/'` for `build` only. **This base must equal
the repo name** — if the repo is ever renamed, update `base`, the `WASHERS`/footer GitHub URLs,
and the README demo link, or the published site loads with broken asset paths.
