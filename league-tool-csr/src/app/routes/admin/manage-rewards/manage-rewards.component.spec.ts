import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRewardsComponent } from './manage-rewards.component';

describe('ManageRewardsComponent', () => {
  let component: ManageRewardsComponent;
  let fixture: ComponentFixture<ManageRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRewardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
