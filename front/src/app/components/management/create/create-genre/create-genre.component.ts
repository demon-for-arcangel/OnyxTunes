import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { GeneroService } from '../../../../services/genero.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create-genre',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  templateUrl: './create-genre.component.html',
  styleUrl: './create-genre.component.css'
})
export class CreateGenreComponent {
  nombre: string = '';
  errors: any = {};

  constructor(public ref: DynamicDialogRef, private generoService: GeneroService) {}

  ngOnInit(): void {}

  validateForm() {
    this.errors = {};
    let isValid = true;
    
    if (!this.nombre) {
      this.errors.nombre = 'El nombre es requerido';
      isValid = false;
    }
  
    return isValid;
  }

  onSubmit() {
    if (this.validateForm()) {
      const genreData = {
        nombre: this.nombre
      };

      this.generoService.createGenero(genreData).subscribe({
        next: (response) => {
          this.ref.close(response);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (error) => {
          console.error('Error al crear género:', error);
          if (error.error?.errors) {
            this.errors = error.error.errors;
          }
        }
      });
    }
  }

  onCancel() {
    this.ref.close();
  }
}
