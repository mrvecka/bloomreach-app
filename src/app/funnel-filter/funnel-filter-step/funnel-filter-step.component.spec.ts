import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelFilterStepComponent } from './funnel-filter-step.component';

describe('FunnelFilterStepComponent', () => {
  let component: FunnelFilterStepComponent;
  let fixture: ComponentFixture<FunnelFilterStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunnelFilterStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunnelFilterStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
