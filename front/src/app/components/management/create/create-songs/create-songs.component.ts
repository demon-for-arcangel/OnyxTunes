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

  generosDisponibles: any[] = [];
  generosSeleccionados: any[] = []; // Inicializado como un array vacío

  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;

  constructor(
    private cancionesService: SongService,
    private generosService: GeneroService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.loadGeneros(); 
    this.generosSeleccionados = []; 
    console.log(this.generosSeleccionados);
  }

  loadGeneros() {
    this.generosService.getGeneros().subscribe(
      (data) => {
        this.generosDisponibles = data; 
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
      this.generosSeleccionados.push(genre); 
    } else {
      this.generosSeleccionados.splice(index, 1); 
    }
  }

  calcularDuracionEnSegundos(): number {
    return (this.horas * 3600) + (this.minutos * 60) + this.segundos;
  }

  crearCancion() {
    this.nuevaCancion.duracion = this.calcularDuracionEnSegundos(); 
    this.nuevaCancion.generos = this.generosSeleccionados.map(g => g.nombre); 
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
