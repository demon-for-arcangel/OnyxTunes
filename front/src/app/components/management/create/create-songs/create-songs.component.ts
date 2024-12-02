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
    this.nuevaCancion.artista = artista.nombre; 
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
