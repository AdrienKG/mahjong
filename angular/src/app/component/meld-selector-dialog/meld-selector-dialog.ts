import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';
import { PossibleMeld } from '../../util/meld-detection';

export interface MeldSelectorDialogData {
  possibleMelds: PossibleMeld[];
  tileName: string;
}

@Component({
  selector: 'app-meld-selector-dialog',
  imports: [MatButtonModule, MatDialogModule, TileDisplayPipe],
  templateUrl: './meld-selector-dialog.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './meld-selector-dialog.scss',
})
export class MeldSelectorDialog {
  data = inject<MeldSelectorDialogData>(MAT_DIALOG_DATA);
}
