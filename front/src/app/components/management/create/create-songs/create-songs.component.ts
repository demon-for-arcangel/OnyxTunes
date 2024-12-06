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
    artista: '',
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
  selectedFile: File | null = null; 

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];

        const fileURL = URL.createObjectURL(this.selectedFile);
        const audio = new Audio(fileURL);

        audio.onloadedmetadata = () => {
            const durationInSeconds = Math.floor(audio.duration);
            this.horas = Math.floor(durationInSeconds / 3600); 
            this.minutos = Math.floor((durationInSeconds % 3600) / 60); 
            this.segundos = durationInSeconds % 60; 
        };
    }
  }

  loadGeneros() {
    this.generosService.getGeneros().subscribe(
      (data) => {
        this.generosDisponibles = data; 
        console.log('Generos disponibles:', this.generosDisponibles);
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
    this.nuevaCancion.generos = this.generosSeleccionados.map(g => g.id); 

    console.log('Datos de la canción a crear:', this.nuevaCancion); 

    if (!this.nuevaCancion.artista_id) {
        console.error('Error: artista_id no está definido');
        return; 
    }

    const formData = new FormData();
    formData.append('titulo', this.nuevaCancion.titulo);
    formData.append('artista_id', this.nuevaCancion.artista_id.toString()); 
    formData.append('album', this.nuevaCancion.album);
    formData.append('duracion', this.nuevaCancion.duracion.toString());
    formData.append('generos', JSON.stringify(this.nuevaCancion.generos)); 

    if (this.selectedFile) {
        formData.append('archivo', this.selectedFile); 
    }

    this.cancionesService.createCancion(formData).subscribe(
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
