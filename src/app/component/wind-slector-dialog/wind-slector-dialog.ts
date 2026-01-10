import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { WindType } from '../../model/wind-type';

@Component({
  selector: 'app-wind-slector-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './wind-slector-dialog.html',
  styleUrl: './wind-slector-dialog.scss',
})
export class WindSlectorDialog {
  public windType = WindType;

  public selectedWind = signal<WindType>(WindType.EAST);
}
