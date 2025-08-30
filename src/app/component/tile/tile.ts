import { Component, input } from '@angular/core';
import { Tile as TileInt } from '../../model/tile';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';

@Component({
  selector: 'app-tile',
  imports: [TileDisplayPipe],
  templateUrl: './tile.html',
  styleUrl: './tile.css'
})
export class Tile {
  public tile = input.required<TileInt>();
}
