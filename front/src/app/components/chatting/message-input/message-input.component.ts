import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MessageService} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {SendMessageApiParams} from '../../../interfaces/message';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TooltipModule
  ],
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css'],
  providers: [MessageService]
})
export class MessageInputComponent {
  constructor(private messageService: MessageService) {}

  messageInput = new FormControl('');
  filesToSend: File[] = [];
  maxFileSize = 1024 * 1024; // 1 MB en bytes
  maxFileCount = 4;

  @Output() onSendMessage = new EventEmitter<SendMessageApiParams>();

  triggerMessageSend = () => {
    if (this.filesToSend.length > 0) {
      this.onSendMessage.emit({files: this.filesToSend});
      this.messageInput.setValue('');
      this.removeFiles(); // Limpiar archivos después de enviar
    } else if (this.messageInput.value && this.messageInput.value.length > 0) {
      this.onSendMessage.emit({text: this.messageInput.value});
      this.messageInput.setValue('');
    }
  }

  openFileDialog = (input: HTMLInputElement) => {
    input.click();
  }

  handleFiles(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files!);

    // Validación de archivos
    const validFiles = this.validateFiles(files);
    if (!validFiles) return;

    this.filesToSend = files;
  }

  validateFiles(files: File[]): boolean {
    if (files.length > this.maxFileCount) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: `No puedes enviar más de ${this.maxFileCount} archivos.`});
      return false;
    }

    for (const file of files) {
      if (file.size > this.maxFileSize) {
        this.messageService.add({severity: 'error', summary: 'Error', detail: `El archivo ${file.name} excede el tamaño máximo de 1 MB.`});
        return false;
      }
    }

    return true;
  }

  removeFiles = () => {
    this.filesToSend = [];
  };

  removeFile(index: number) {
    this.filesToSend.splice(index, 1);
  }
}
