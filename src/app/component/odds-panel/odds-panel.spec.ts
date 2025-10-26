import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OddsPanel } from './odds-panel';

describe('OddsPanel', () => {
  let component: OddsPanel;
  let fixture: ComponentFixture<OddsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OddsPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OddsPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
