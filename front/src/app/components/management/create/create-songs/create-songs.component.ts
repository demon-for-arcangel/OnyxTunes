import { Component } from '@angular/core';
import { SongService } from '../../../../services/song.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { GeneroService } from '../../../../services/genero.service';
import { UserService } from '../../../../services/user.service';

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
    artista: '', // Para mostrar el nombre del artista
    artista_id: 0,
    album: '',
    duracion: 0,
    generos: []
  };

  generosDisponibles: any[] = [];
  generosSeleccionados: any[] = [];
  artistasDisponibles: any[] = [];
  artistasFiltrados: any[] = [];
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  showArtistas: boolean = false;

  constructor(
    private cancionesService: SongService,
    private generosService: GeneroService,
    private usuarioService: UserService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    this.loadGeneros(); 
    this.loadArtistas(); 
  }

  loadGeneros() {
    this.generosService.getGeneros().subscribe(
      (data) => {
        this.generosDisponibles = data; 
      },
      (error) => {
        console.error('Error al cargar los géneros:', error);
      }
    );
  }

  loadArtistas() {
    this.usuarioService.getArtists().subscribe(
        (data) => {
            this.artistasDisponibles = data; 
            this.artistasFiltrados = data; 
            console.log('Artistas disponibles:', this.artistasDisponibles); // Verifica los datos
        },
        (error) => {
            console.error('Error al cargar los artistas:', error);
        }
    );
}

  filterArtistas(event: any) {
    const query = event.target.value.toLowerCase();
    this.artistasFiltrados = this.artistasDisponibles.filter(artista => 
      artista.nombre.toLowerCase().includes(query)
    );
    this.showArtistas = query.length > 0;
  }

  onFocus() {
    this.showArtistas = true; 
  }

  onBlur() {
    setTimeout(() => {
      this.showArtistas = false;
    }, 100); 
  }

  selectArtista(artista: any) {
    console.log('Artista seleccionado:', artista); // Verifica que el artista tenga un ID
    this.nuevaCancion.artista = artista.nombre; // Almacenar el nombre del artista para mostrar
    this.nuevaCancion.artista_id = artista.id; // Almacenar el ID del artista para enviar
    console.log('ID del artista asignado:', this.nuevaCancion.artista_id); // Verifica el ID asignado
    this.showArtistas = false; 
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

    console.log('Datos de la canción a crear:', this.nuevaCancion); // Verifica los datos

    // Asegúrate de que artista_id esté presente
    if (!this.nuevaCancion.artista_id) {
        console.error('Error: artista_id no está definido');
        return; // Salir si no hay artista_id
    }

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
