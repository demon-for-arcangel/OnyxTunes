import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.css'
})
export class DeleteConfirmationComponent {
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig
  ) {}

  onConfirm() {
    this.ref.close(true);
  }

  onCancel() {
    this.ref.close(false);
  }
}
