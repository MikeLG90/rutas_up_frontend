import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importa DomSanitizer

@Component({
  selector: 'app-document-viewer-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-viewer-modal.component.html',
})
export class DocumentViewerModalComponent implements OnInit {
  
  @Input() documentUrl!: string; 
  
  safeDocumentUrl: SafeResourceUrl | null = null;
  
  constructor(
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer 
  ) {}

  ngOnInit(): void {
    if (this.documentUrl) {
      // Sanitización: Esencial para que el iframe pueda cargar la URL externa/API
      this.safeDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.documentUrl);
    }
  }
}