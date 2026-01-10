import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileSelectorDialog } from './tile-selector-dialog';

describe('TileSelectorDialog', () => {
  let component: TileSelectorDialog;
  let fixture: ComponentFixture<TileSelectorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileSelectorDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TileSelectorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
