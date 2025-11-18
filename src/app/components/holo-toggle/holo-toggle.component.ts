import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-holo-toggle',
  standalone: true,
  imports: [],
  templateUrl: './holo-toggle.component.html',
  styleUrl: './holo-toggle.component.scss'
})
export class HoloToggleComponent {

  // se definen las entradas para hacer el cambio de estado
  @Input() activo: 0 | 1 = 0;
  @Input() identificador: string = "default-toggle-id";
  // se define el evento de cambio de estado del registro
  @Output() cambio = new EventEmitter<void>();

  onToggleChange(): void {
    this.cambio.emit();
  }

}
