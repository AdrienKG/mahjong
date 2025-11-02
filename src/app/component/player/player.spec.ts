import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPlayer } from './current-player';

describe('CurrentPlayer', () => {
  let component: CurrentPlayer;
  let fixture: ComponentFixture<CurrentPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentPlayer],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
