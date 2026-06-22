import { Component } from '@angular/core';
import { Table } from '../table/table';

@Component({
  selector: 'app-app-container',
  imports: [Table],
  templateUrl: './app-container.html',
  styleUrl: './app-container.scss',
})
export class AppContainer {}
