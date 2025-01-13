import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GeneroService } from '../../../../services/genero.service';
import { Genre } from '../../../../interfaces/genre';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-genre',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-genre.component.html',
  styleUrl: './update-genre.component.css'
})
export class UpdateGenreComponent {
  genreId: number;
  nombre: string = '';
  errors: any = {};

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private generoService: GeneroService
  ) {
    this.genreId = this.config.data.genreId;
  }

  ngOnInit(): void {
    this.loadGenre();
  }

  loadGenre(): void {
    this.generoService.getGeneroById(this.genreId).subscribe({
      next: (genre) => {
        this.nombre = genre.nombre;
      },
      error: (error) => {
        console.error('Error al cargar género:', error);
      }
    });
  }

  validateForm(): boolean {
    this.errors = {};
    let isValid = true;

    if (!this.nombre) {
      this.errors.nombre = 'El nombre es requerido';
      isValid = false;
    }

    return isValid;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      const updatedData: Genre = {
        id: this.genreId,
        nombre: this.nombre
      };

      this.generoService.updateGenero(this.genreId, updatedData).subscribe({
        next: (response) => {
          this.ref.close(response);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (error) => {
          console.error('Error al actualizar género:', error);
          if (error.error?.errors) {
            this.errors = error.error.errors;
          }
        }
      });
    }
  }

  onCancel(): void {
    this.ref.close();
  }
}
