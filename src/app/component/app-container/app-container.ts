import { Component } from '@angular/core';
import { OddsPanel } from '../odds-panel/odds-panel';
import { Table } from '../table/table';

@Component({
  selector: 'app-app-container',
  imports: [Table, OddsPanel],
  templateUrl: './app-container.html',
  styleUrl: './app-container.scss',
})
export class AppContainer {}
