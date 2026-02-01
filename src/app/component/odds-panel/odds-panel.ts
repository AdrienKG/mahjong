import { Component, inject } from '@angular/core';
import { TableStore } from '../../store/table-store';
import { AdditionalPoints } from '../additional-points/additional-points';
import { HandScore } from '../hand-score/hand-score';

@Component({
  selector: 'app-odds-panel',
  imports: [AdditionalPoints, HandScore],
  templateUrl: './odds-panel.html',
  styleUrl: './odds-panel.scss',
})
export class OddsPanel {
  tableStore = inject(TableStore);
}
