import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalPoints } from './additional-points';

describe('AdditionalPoints', () => {
  let component: AdditionalPoints;
  let fixture: ComponentFixture<AdditionalPoints>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalPoints]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalPoints);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
