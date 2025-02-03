import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGamesComponent } from './manage-leagues.component';

describe('ManageLeaguesComponent', () => {
  let component: ManageGamesComponent;
  let fixture: ComponentFixture<ManageGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
