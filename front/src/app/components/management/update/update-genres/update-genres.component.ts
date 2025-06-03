import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeneroService } from '../../../../services/genero.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-update-genres',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-genres.component.html',
  styleUrl: './update-genres.component.css'
})
export class UpdateGenresComponent implements OnInit {
  generoId!: number;
  genero: any = {
    nombre: '',
    descripcion: ''
  };
  successMessage: string = "";
  errorMessage: string = '';

  constructor(private generoService: GeneroService, private config: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.generoId = this.config.data.generoId;
    this.loadGenero();
  }

  loadGenero(): void {
    this.generoService.getGeneroById(this.generoId).subscribe(
      (data) => {
        this.genero = data;
      },
      (error) => {
        console.error('Error al cargar el género:', error);
      }
    );
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('nombre', this.genero.nombre);

    this.generoService.updateGenero(formData, this.generoId).subscribe({
      next: () => {
        this.successMessage = "Género actualizado correctamente.";
        setTimeout(() => {
          this.successMessage = "";
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = "Error al actualizar el género.";
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000);
      }
    });
  }
}
