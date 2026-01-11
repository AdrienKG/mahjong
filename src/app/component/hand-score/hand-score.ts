import { Component, computed, inject } from '@angular/core';
import { SuitedTile } from '../../model/suited-tile';
import { TileType } from '../../model/tile-type';
import { TableStore } from '../../store/table-store';

@Component({
  selector: 'app-hand-score',
  imports: [],
  templateUrl: './hand-score.html',
  styleUrl: './hand-score.css',
})
export class HandScore {
  private tableStore = inject(TableStore);

  suiteCount = 3;
  counts = computed<number[][]>(() => {
    const currentPlayer = this.tableStore.entities()[0];

    const tiles = currentPlayer.tiles;
    const counts: number[][] = Array.from({ length: this.suiteCount }, () =>
      Array(10).fill(0),
    );
    tiles.forEach((t) => {
      const st = t as SuitedTile;
      counts[st.suite][st.number]++;
    });

    return counts;
  });

  allChi = computed<boolean>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    // All tiles must be suited (no winds/dragons/bonus)
    if (tiles.some((t) => t.type !== TileType.SUITED)) {
      return false;
    }

    // Build counts per suite (3 suites) for numbers 1..9
    const canFormChis = (c: number[][]) => {
      for (let s = 0; s < this.suiteCount; s++) {
        for (let n = 1; n <= 9; n++) {
          while (c[s][n] > 0) {
            const take = c[s][n];
            if (n + 2 > 9 || c[s][n + 1] < take || c[s][n + 2] < take) {
              return false;
            }
            c[s][n] -= take;
            c[s][n + 1] -= take;
            c[s][n + 2] -= take;
          }
        }
      }
      return true;
    };

    // Try every possible pair choice
    for (let s = 0; s < this.suiteCount; s++) {
      for (let n = 1; n <= 9; n++) {
        if (this.counts()[s][n] >= 2) {
          // You need a pair (eyes) for a valid hand. Don't bother checking without it.
          const clone = this.counts().map((arr) => arr.slice());
          clone[s][n] -= 2; // remove the pair (eyes)
          return canFormChis(clone);
        }
      }
    }

    return false;
  });

  mixedTwoSuit = computed<boolean>(() => {
    const currentPlayer = this.tableStore.entities()[0];
    const tiles = currentPlayer.tiles;

    // No honours allowed
    if (tiles.some((t) => t.type !== TileType.SUITED)) {
      return false;
    }

    // Must use exactly two suits
    const suitsUsed = new Set<number>();
    tiles.forEach((t) => suitsUsed.add((t as SuitedTile).suite));
    if (suitsUsed.size !== 2) {
      return false;
    }

    const canFormMelds = (c: number[][]): boolean => {
      for (let s = 0; s < this.suiteCount; s++) {
        for (let n = 1; n <= 9; n++) {
          if (c[s][n] > 0) {
            // Try pung/kong (remove 3)
            if (c[s][n] >= 3) {
              c[s][n] -= 3;
              if (canFormMelds(c)) {
                return true;
              }
              c[s][n] += 3;
            }

            // Try chi (sequence)
            if (n + 2 <= 9 && c[s][n + 1] > 0 && c[s][n + 2] > 0) {
              c[s][n]--;
              c[s][n + 1]--;
              c[s][n + 2]--;
              if (canFormMelds(c)) {
                return true;
              }
              c[s][n]++;
              c[s][n + 1]++;
              c[s][n + 2]++;
            }

            return false;
          }
        }
      }
      return true;
    };

    // Try every possible pair choice
    for (let s = 0; s < this.suiteCount; s++) {
      for (let n = 1; n <= 9; n++) {
        if (this.counts()[s][n] >= 2) {
          // You need a pair (eyes) for a valid hand. Don't bother checking without it.
          const clone = this.counts().map((arr) => arr.slice());
          clone[s][n] -= 2; // remove pair
          return canFormMelds(clone);
        }
      }
    }

    return false;
  });
}
