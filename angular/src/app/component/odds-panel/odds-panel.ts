import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TableStore } from '../../store/table-store';
import { AdditionalPoints } from '../additional-points/additional-points';
import { HandScore } from '../hand-score/hand-score';
import { SpecialHands } from '../special-hands/special-hands';

@Component({
  selector: 'app-odds-panel',
  imports: [MatAccordion, AdditionalPoints, HandScore, SpecialHands],
  templateUrl: './odds-panel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './odds-panel.scss',
})
export class OddsPanel {
  tableStore = inject(TableStore);
}
