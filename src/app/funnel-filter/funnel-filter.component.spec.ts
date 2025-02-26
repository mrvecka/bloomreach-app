import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunnelFilterComponent } from './funnel-filter.component';

describe('FunnelFilterComponent', () => {
  let component: FunnelFilterComponent;
  let fixture: ComponentFixture<FunnelFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunnelFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FunnelFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
