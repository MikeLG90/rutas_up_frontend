import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LogService } from '../../../../services/log.service';

@Component({
  selector: 'app-logs',
  standalone: true, 
  imports: [CommonModule, HttpClientModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent {
  logs: string[] = [];

  constructor(private logService: LogService) {}

  ngOnInit() {
    this.cargarLogs();
  }

  cargarLogs() {
    this.logService.getLogs().subscribe(
      (data) => (this.logs = data.logs),
      (error) => console.error('Error obteniendo logs', error)
    );
  }
}
