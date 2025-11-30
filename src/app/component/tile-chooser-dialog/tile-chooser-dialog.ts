import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';
import { TableStore } from '../../store/table-store';

@Component({
  selector: 'app-tile-chooser-dialog',
  imports: [FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatSelectModule, TileDisplayPipe],
  templateUrl: './tile-chooser-dialog.html',
  styleUrl: './tile-chooser-dialog.scss',
})
export class TileChooserDialog {
  public store = inject(TableStore);

  public selectedTileId: string | null = null;
}
