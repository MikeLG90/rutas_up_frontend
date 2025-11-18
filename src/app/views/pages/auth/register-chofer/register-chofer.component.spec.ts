import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterChoferComponent } from './register-chofer.component';

describe('RegisterChoferComponent', () => {
  let component: RegisterChoferComponent;
  let fixture: ComponentFixture<RegisterChoferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterChoferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
