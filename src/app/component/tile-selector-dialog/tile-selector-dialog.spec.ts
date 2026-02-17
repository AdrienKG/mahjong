import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';

import { TileSelectorDialog } from './tile-selector-dialog';

describe('TileSelectorDialog', () => {
  let component: TileSelectorDialog;
  let fixture: ComponentFixture<TileSelectorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileSelectorDialog],
      providers: [TileDisplayPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TileSelectorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
