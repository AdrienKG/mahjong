# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A **Mahjong scoring calculator** built as a client-side Angular application. It tracks player hands, detects valid winning patterns, and calculates points. There is no backend.

## Commands

- `npm start` - Dev server at http://localhost:4200
- `npm test` - Unit tests (Karma + Jasmine, launches Chrome)
- `npm run build` - Production build
- `npm run format` - Prettier formatting

## Tech Stack

- Angular 21 (standalone components, signals, zoneless change detection)
- @ngrx/signals for state management
- Angular Material (cyan-orange theme)
- TypeScript 5.9 with strict mode
- SCSS for styles

## Architecture

### State: `src/app/store/table-store.ts`

Single `signalStore` (providedIn root) managing the entire game state:

- **Entities**: 4 players (seats 0-3) each with `tiles[]`, `exposedTiles[]`, `bonusTiles[]`
- **Table state**: wind, discard pile, tile wall (144 tiles), draw tracking
- **Computed signals**: odds calculations for additional points (dragon pungs, wind pungs, terminal pungs, etc.)
- Players are initialized on store `onInit` with 13 UNKNOWN tiles each

### Tile Model: `src/app/model/`

Tiles use a discriminated union pattern via `TileType` enum:

- `Tile` (base: id + type) → `SuitedTile` (suite + number 1-9), `HonourTile` (wind/dragon), `BonusTile` (flower/season)
- Tile keys for comparison are generated as strings like `"SUITED-BAMBOO-3"` or `"HONOUR-DRAGON-RED"`
- Suited tile suites: BAMBOO, CHARACTER, DOTS (enum values 0, 1, 2)

### Scoring: `src/app/component/`

Scoring logic lives in components (not services), using computed signals:

- **`hand-score/`** - Standard hands using backtracking on a `counts[3][10]` array (suite × number). Algorithms: `canFormChis()` (greedy), `canFormMelds()` and `canFormAllPungs()` (recursive backtracking with clone/restore). Hands: all-chi (1pt), mixed-two-suit (1pt), all-pung (2pt, +3 if all even/odd), little-seven-pairs (6pt), big-seven-pairs (9pt), purity (9pt).

- **`special-hands/`** - 15-point hands evaluated as mutually exclusive (first match wins via `||` chain): thirteen orphans, heaven's/earth's hand, all-hidden-pung-kong, four winds (small/big), three big dragons, all-terminal, all-honours, nine connected sons.

- **`additional-points/`** - Bonus point calculations (eyes, kongs, flowers, wind/dragon pungs, etc.)

### Components: `src/app/component/`

- **`app-container/`** - Root layout combining table + odds panel
- **`table/`** - Game board with actions (pickup, discard, wind change, randomize)
- **`player/`** - Single player's hand display
- **`tile/`** - Individual tile with context menu (set via dialog, discard, expose)
- **`odds-panel/`** - Aggregates all scoring components
- **`tile-selector-dialog/`** - Modal for picking a specific tile from the wall
- **`wind-slector-dialog/`** - Modal for selecting table wind (note: typo in directory name is intentional)

### Pipes: `src/app/pipe/`

Display formatting: tile-display (e.g. "3B", "GD"), sort-tiles, tile-filter, probability formatting.

## Key Patterns

- Player index 0 (`PlayerSeat.current`) is always the "current player" whose hand is scored
- The `counts` array pattern (`number[3][10]`, indices: suite 0-2, number 1-9, index 0 unused for honours) is used across hand-score and special-hands for meld detection
- Tiles have UUID-based `id` fields for identity tracking; `getTileKey()` generates semantic keys for value comparison
- Exposed tiles are tracked separately from hand tiles and affect scoring (e.g., all-hidden-pung-kong requires no exposed tiles)
