import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelFilterStepConditionComponent } from './funnel-filter-step-condition.component';

describe('FunnelFilterStepConditionComponent', () => {
  let component: FunnelFilterStepConditionComponent;
  let fixture: ComponentFixture<FunnelFilterStepConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunnelFilterStepConditionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunnelFilterStepConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
