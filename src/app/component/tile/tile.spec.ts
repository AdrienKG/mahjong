import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerSeat } from '../../model/player-seat';
import { TileType } from '../../model/tile-type';

import { Tile } from './tile';

describe('Tile', () => {
  let component: Tile;
  let fixture: ComponentFixture<Tile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tile],
    }).compileComponents();

    fixture = TestBed.createComponent(Tile);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tile', {
      id: 'test-id',
      type: TileType.UNKNOWN,
    });
    fixture.componentRef.setInput('playerId', PlayerSeat.current);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
