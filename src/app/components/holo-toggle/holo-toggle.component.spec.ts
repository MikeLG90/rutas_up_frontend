import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoloToggleComponent } from './holo-toggle.component';

describe('HoloToggleComponent', () => {
  let component: HoloToggleComponent;
  let fixture: ComponentFixture<HoloToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoloToggleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoloToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
