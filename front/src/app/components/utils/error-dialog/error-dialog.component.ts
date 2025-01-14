import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.css'
})
export class ErrorDialogComponent {
  message: string;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
    this.message = this.config.data.message;
  }

  close() {
    this.ref.close();
  }
}
