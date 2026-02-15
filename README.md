# Mahjong Scoring Calculator

A client-side Mahjong scoring calculator that tracks player hands, detects valid winning patterns, and calculates points. Built with Angular as a single-page application with no backend.

## Frameworks & Technologies

- **Angular 21** - Standalone components, signals, zoneless change detection
- **@ngrx/signals** - State management via a single `signalStore`
- **Angular Material** - UI components with a cyan-orange theme
- **TypeScript 5.9** - Strict mode enabled
- **SCSS** - Styling
- **Karma + Jasmine** - Unit testing

## How It Works

### Game State

A single signal store manages the entire game table: 4 players (each with hand tiles, exposed tiles, and bonus tiles), the table wind, a discard pile, and a 144-tile wall. Player 0 is always the "current player" whose hand is scored.

### Tile System

Tiles use a discriminated union model with three types:

- **Suited tiles** - Bamboo, Character, and Dots, numbered 1-9
- **Honour tiles** - Winds and Dragons
- **Bonus tiles** - Flowers and Seasons

Each tile has a unique ID for tracking and a semantic key (e.g. `"SUITED-BAMBOO-3"`) for value comparison.

### Scoring

Scoring is split into three categories:

- **Standard hands** - Detected using backtracking on a `counts[3][10]` array (suite x number). Includes all-chi, mixed-two-suit, all-pung, seven pairs, and purity hands, worth 1-9 points.
- **Special hands** - 15-point hands evaluated as mutually exclusive (first match wins). Includes thirteen orphans, heaven's/earth's hand, all-hidden-pung-kong, four winds, three big dragons, all-terminal, all-honours, and nine connected sons.
- **Additional points** - Bonus points for eyes, kongs, flowers, wind/dragon pungs, and terminal pungs.

### UI

The interface displays the game table with player hands, an odds panel aggregating all scoring components, and dialogs for selecting specific tiles or changing the table wind. Players can pick up tiles, discard, expose melds (chi, pung, kong), and randomize hands.

## Development

```bash
npm start       # Dev server at http://localhost:4200
npm test        # Unit tests
npm run build   # Production build
npm run format  # Prettier formatting
```
