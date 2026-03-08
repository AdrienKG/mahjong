import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerSeat } from '../../model/player-seat';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';

import { Player } from './player';

describe('Player', () => {
  let component: Player;
  let fixture: ComponentFixture<Player>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Player],
      providers: [TileDisplayPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(Player);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('playerSeat', PlayerSeat.current);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
