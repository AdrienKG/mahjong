import { Component, inject } from '@angular/core';
import { ProbabilityPipe } from '../../pipe/probability-pipe';
import { TableStore } from '../../store/table-store';

@Component({
  selector: 'app-odds-panel',
  imports: [ProbabilityPipe],
  templateUrl: './odds-panel.html',
  styleUrl: './odds-panel.css',
})
export class OddsPanel {
  tableStore = inject(TableStore);
}
