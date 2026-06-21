import { Component, ChangeDetectionStrategy } from '@angular/core';
import { OddsPanel } from '../odds-panel/odds-panel';
import { Table } from '../table/table';

@Component({
  selector: 'app-app-container',
  imports: [Table, OddsPanel],
  templateUrl: './app-container.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app-container.scss',
})
export class AppContainer {}
