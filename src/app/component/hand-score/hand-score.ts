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

  allChi = computed<boolean>(() => {
    const currentPlayer = this.tableStore.entities()[0];

    const tiles = currentPlayer.tiles;
    if (tiles.length !== 14) return false;

    // All tiles must be suited (no winds/dragons/bonus)
    if (tiles.some((t) => t.type !== TileType.SUITED)) return false;

    // Build counts per suite (3 suites) for numbers 1..9
    const suiteCount = 3;
    const counts: number[][] = Array.from({ length: suiteCount }, () => Array(10).fill(0));
    tiles.forEach((t) => {
      const st = t as SuitedTile;
      counts[st.suite][st.number]++;
    });

    const canFormChis = (c: number[][]) => {
      for (let s = 0; s < suiteCount; s++) {
        for (let n = 1; n <= 9; n++) {
          while (c[s][n] > 0) {
            const take = c[s][n];
            if (n + 2 > 9) return false;
            if (c[s][n + 1] < take || c[s][n + 2] < take) return false;
            c[s][n] -= take;
            c[s][n + 1] -= take;
            c[s][n + 2] -= take;
          }
        }
      }
      return true;
    };

    // Try every possible pair choice
    for (let s = 0; s < suiteCount; s++) {
      for (let n = 1; n <= 9; n++) {
        if (counts[s][n] >= 2) {
          const clone = counts.map((arr) => arr.slice());
          clone[s][n] -= 2; // remove the pair (eyes)
          if (canFormChis(clone)) return true;
        }
      }
    }

    return false;
  });
}
