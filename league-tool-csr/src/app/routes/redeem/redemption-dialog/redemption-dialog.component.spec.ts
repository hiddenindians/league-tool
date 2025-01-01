import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedemptionDialogComponent } from './redemption-dialog.component';

describe('RedemptionDialogComponent', () => {
  let component: RedemptionDialogComponent;
  let fixture: ComponentFixture<RedemptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedemptionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedemptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
