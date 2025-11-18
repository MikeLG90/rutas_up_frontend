import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaRouterComponent } from './mapa-router.component';

describe('MapaRouterComponent', () => {
  let component: MapaRouterComponent;
  let fixture: ComponentFixture<MapaRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaRouterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
