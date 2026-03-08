import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WindSlectorDialog } from './wind-slector-dialog';

describe('WindSlectorDialog', () => {
  let component: WindSlectorDialog;
  let fixture: ComponentFixture<WindSlectorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WindSlectorDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(WindSlectorDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
