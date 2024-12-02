import { Component } from '@angular/core';
import { SongService } from '../../../../services/song.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { GeneroService } from '../../../../services/genero.service';

@Component({
  selector: 'app-create-songs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-songs.component.html',
  styleUrl: './create-songs.component.css'
})
export class CreateSongsComponent {
  nuevaCancion: any = {
    titulo: '',
    artista: '',
    album: '',
    duracion: 0,
    generos: []
  };

  generosDisponibles: any[] = []; // Cambia a un array de objetos
  generosSeleccionados: any[] = []; // Cambia a un array de objetos

  constructor(
    private cancionesService: SongService,
    private generosService: GeneroService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.loadGeneros(); 
  }

  loadGeneros() {
    this.generosService.getGeneros().subscribe(
      (data) => {
        this.generosDisponibles = data; // Asignar los objetos recibidos
        console.log(this.generosDisponibles);
      },
      (error) => {
        console.error('Error al cargar los géneros:', error);
      }
    );
  }

  toggleGenre(genre: any) {
    const index = this.generosSeleccionados.indexOf(genre);
    if (index === -1) {
      this.generosSeleccionados.push(genre); // Añadir objeto de género
    } else {
      this.generosSeleccionados.splice(index, 1); // Quitar objeto de género
    }
  }

  crearCancion() {
    this.nuevaCancion.generos = this.generosSeleccionados.map(g => g.nombre); // Asignar nombres de géneros seleccionados
    this.cancionesService.createCancion(this.nuevaCancion).subscribe(
      (response) => {
        console.log('Canción añadida:', response);
        this.ref.close(); 
      },
      (error) => {
        console.error('Error al añadir la canción', error);
      }
    );
  }
}
