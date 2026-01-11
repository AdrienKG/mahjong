import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandScore } from './hand-score';

describe('HandScore', () => {
  let component: HandScore;
  let fixture: ComponentFixture<HandScore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandScore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandScore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
