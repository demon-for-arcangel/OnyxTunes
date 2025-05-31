import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../../../services/song.service';
import { GeneroService } from '../../../../services/genero.service';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-update-songs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-songs.component.html',
  styleUrls: ['./update-songs.component.css']
})
export class UpdateSongsComponent implements OnInit {
  cancionId!: number; 
  cancion: any = {};
  generosDisponibles: any[] = [];
  artistas: any[] = [];
  selectedFile: File | null = null;
  colaboradoresSeleccionados: any[] = [];
  filtroColaboradores: string = '';
  artistasFiltrados: any[] = [];
  artistasDisponibles: any[] = [];
  showArtistas: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cancionesService: SongService,
    private generosService: GeneroService,
    private config: DynamicDialogConfig,
    private usuarioService: UserService
  ) {}

  ngOnInit(): void {
    this.cancionId = this.config.data.cancionId;
    console.log(this.cancionId);
    this.loadCancion(); 
    this.loadGeneros(); 
    this.loadColaboradores();
  }

  loadCancion(): void {
    this.cancionesService.getCancionById(this.cancionId).subscribe(
      (data) => {
        console.log("Datos recibidos en el frontend:", data);
        console.log("Géneros recibidos en el frontend:", data.generos);
        this.cancion = data; 

        this.cancion.portada = data.portadaURL || '';
        if (data.colaboradores) {
          this.colaboradoresSeleccionados = data.colaboradores.map((colab: any) => colab.usuario_id);
        }

        this.loadGenerosPorCancion();

        console.log(this.cancion);
        console.log(this.cancion.generos)
      },
      (error) => {
        console.error('Error al cargar la canción:', error);
      }
    );
  }

  loadGenerosPorCancion(): void {
    this.cancionesService.getGenreBySong(this.cancionId).subscribe(
      (data) => {
        console.log("Géneros obtenidos en el frontend antes de asignar:", data);
        this.cancion.generos = Array.isArray(data) ? data : []; 
        console.log("Géneros en el estado después de asignar:", this.cancion.generos);
      },
      (error) => {
        console.error('Error al cargar los géneros de la canción:', error);
      }
    );
}

  loadGeneros(): void {
    this.generosService.getGeneros().subscribe(
      (data) => {
        this.generosDisponibles = data; 
      },
      (error) => {
        console.error('Error al cargar los géneros:', error);
      }
    );
  }

  loadColaboradores() {
  this.usuarioService.getArtists().subscribe(
    (data) => {
      this.artistasDisponibles = data;
      this.artistasFiltrados = [...data];  

      console.log("🔹 Artistas disponibles:", this.artistasDisponibles);
      console.log("🔹 Artistas filtrados al inicio:", this.artistasFiltrados);
    },
    (error) => {
      console.error("Error al cargar los artistas:", error);
    }
  );
}


  toggleColaborador(artista: any) {
    const index = this.colaboradoresSeleccionados.indexOf(artista.id);
    console.log("Artista seleccionado:", artista);
    console.log("Colaboradores seleccionados:", this.colaboradoresSeleccionados);
    console.log("Index encontrado:", index);
    console.log("Artista ID:", artista.id);
    if (index === -1) {
      this.colaboradoresSeleccionados.push(artista.id);
    } else {
      this.colaboradoresSeleccionados.splice(index, 1);
    }
  }

  getArtistasFiltrados(): any[] {
    return this.artistasDisponibles.filter(artista =>
      artista.nombre.toLowerCase().includes(this.filtroColaboradores.toLowerCase())
    );
  }

  updateFiltroColaboradores(): void {
  console.log("🔹 Buscando colaboradores con:", this.filtroColaboradores);
  this.artistasFiltrados = this.artistasDisponibles.filter(artista =>
    artista.nombre.toLowerCase().includes(this.filtroColaboradores.toLowerCase())
  );
  console.log("🔹 Resultado del filtro:", this.artistasFiltrados);
}



  filterArtistas(event: any) {
    const query = event.target.value.toLowerCase();
    this.artistasFiltrados = this.artistasDisponibles.filter(artista =>
      artista.nombre.toLowerCase().includes(query)
    );
    this.showArtistas = query.length > 0;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      console.log("Archivo seleccionado:", file);
      this.selectedFile = file;
      this.cancion.portada = URL.createObjectURL(file);
    } else {
      console.error("No se selecciono ningun archivo.")
    }
  }

    onSubmit(): void {
      const formData = new FormData();
      formData.append('titulo', this.cancion.titulo);
      formData.append('duracion', this.cancion.duracion);
      formData.append('artista_id', this.cancion.artista_id.toString());
  
      this.cancion.generos.forEach((genero: any, index: number) => {
        formData.append(`generos[${index}]`, genero);
      });

      this.colaboradoresSeleccionados.forEach((colaboradorId) => {
        formData.append("colaboradores", colaboradorId.toString());
      });

      if (this.selectedFile) {
        formData.append('portada', this.selectedFile, this.selectedFile.name);
      }
  
      this.cancionesService.updateCancion(this.cancionId, formData).subscribe(
        (response) => {
          console.log('Canción actualizada:', response);
        },
        (error) => {
          console.error('Error al actualizar la canción:', error);
        }
      );
    }
}
