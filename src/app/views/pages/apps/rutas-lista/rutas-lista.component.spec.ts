import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasListaComponent } from './rutas-lista.component';

describe('RutasListaComponent', () => {
  let component: RutasListaComponent;
  let fixture: ComponentFixture<RutasListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RutasListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutasListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
