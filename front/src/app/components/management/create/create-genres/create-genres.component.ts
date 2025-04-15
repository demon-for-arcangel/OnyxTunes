import { Component } from '@angular/core';
import { GeneroService } from '../../../../services/genero.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-genres',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-genres.component.html',
  styleUrl: './create-genres.component.css'
})
export class CreateGenresComponent {
  nuevoGenero: any = {
    nombre: ''
  };

  constructor( private generoService: GeneroService, public ref: DynamicDialogRef) {}

  ngOnInit(): void {}

  crearGenero() {
    const formData = new FormData();
    formData.append('nombre', this.nuevoGenero.nombre);
    this.generoService.createGenero(formData).subscribe(
      (response) => {
        console.log("Genero añadido", response);
        this.ref.close();
      },
      (error) => {
        console.log("Error al añadir el genero", error);
      }
    );
  }
}
