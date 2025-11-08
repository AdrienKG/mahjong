import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileChooserDialog } from './tile-chooser-dialog';

describe('TileChooserDialog', () => {
  let component: TileChooserDialog;
  let fixture: ComponentFixture<TileChooserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TileChooserDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TileChooserDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
