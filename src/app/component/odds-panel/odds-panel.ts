import { Component, inject } from '@angular/core';
import { ProbabilityPipe } from '../../pipe/probability-pipe';
import { TableStore } from '../../store/table-store';
import { HandScore } from '../hand-score/hand-score';

@Component({
  selector: 'app-odds-panel',
  imports: [ProbabilityPipe, HandScore],
  templateUrl: './odds-panel.html',
  styleUrl: './odds-panel.scss',
})
export class OddsPanel {
  tableStore = inject(TableStore);
}
