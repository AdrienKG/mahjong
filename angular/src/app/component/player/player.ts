import {
  Component,
  input
} from '@angular/core';
import { Tile as TileModel } from '../../model/tile';
import { WindType } from '../../model/wind-type';
import { Tile } from '../tile/tile';

@Component({
  selector: 'app-player',
  imports: [Tile],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class Player {
  wind = input.required<WindType>();
  hand = input.required<TileModel[]>();
}
