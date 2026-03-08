import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';

import {
  MeldSelectorDialog,
  MeldSelectorDialogData,
} from './meld-selector-dialog';

describe('MeldSelectorDialog', () => {
  let component: MeldSelectorDialog;
  let fixture: ComponentFixture<MeldSelectorDialog>;

  beforeEach(async () => {
    const dialogData: MeldSelectorDialogData = {
      possibleMelds: [],
      tileName: '3B',
    };

    await TestBed.configureTestingModule({
      imports: [MeldSelectorDialog],
      providers: [
        TileDisplayPipe,
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeldSelectorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
