import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TileDisplayPipe } from '../../pipe/tile-display-pipe';

import { AppContainer } from './app-container';

describe('AppContainer', () => {
  let component: AppContainer;
  let fixture: ComponentFixture<AppContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppContainer],
      providers: [TileDisplayPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(AppContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
