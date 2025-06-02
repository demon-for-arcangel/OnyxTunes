import { Component } from "@angular/core";
import { SongService } from "../../../../services/song.service";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { FormsModule } from "@angular/forms";
import { GeneroService } from "../../../../services/genero.service";
import { UserService } from "../../../../services/user.service";
import { AlbumsService } from "../../../../services/albums.service";
import { AuthService } from "../../../../services/auth.service";

@Component({
  selector: "app-create-songs",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./create-songs.component.html",
  styleUrls: ["./create-songs.component.css"],
})
export class CreateSongsComponent {
  nuevaCancion: any = {
    titulo: "",
    artista: "",
    artista_id: 0,
    album: "",
    duracion: 0,
    generos: [],
  };

  generosDisponibles: any[] = [];
  generosSeleccionados: any[] = [];
  artistasDisponibles: any[] = [];
  artistasFiltrados: any[] = [];
  albumsDisponibles: any[] = [];
  horas: number = 0;
  minutos: number = 0;
  segundos: number = 0;
  showArtistas: boolean = false;
  selectedFiles: File[] = [];
  user: any;
  userRol: string = ''
  colaboradoresSeleccionados: any[] = [];
  filtroColaboradores: string = "";

  constructor(
    private cancionesService: SongService,
    private generosService: GeneroService,
    private usuarioService: UserService,
    public ref: DynamicDialogRef,
    private albumsService: AlbumsService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadGeneros();
    this.loadArtistas();
    this.getUserId();
  }

  getUserId() {
    const token = localStorage.getItem("user");
    if (token) {
      this.authService.getUserByToken(token).subscribe(
        (response) => {
          this.user = response;
  
          if (this.user.Rol && Array.isArray(this.user.Rol)) {
            this.userRol = this.user.Rol[0].nombre; 
          } else if (this.user.Rol) {
            this.userRol = this.user.Rol.nombre;
          }
  
          if (this.userRol === "Artista") {
            this.nuevaCancion.artista = this.user.nombre;
            this.nuevaCancion.artista_id = this.user.id;
          }
        },
        (error) => {
          console.error("Error al obtener el usuario:", error);
        }
      );
    }
  }


  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files); 
  
      if (this.selectedFiles) {
        const file = this.selectedFiles[0];
        const fileURL = URL.createObjectURL(file);
        const audio = new Audio(fileURL);
  
        audio.onloadedmetadata = () => {          
          const durationInSeconds = Math.floor(audio.duration);
          this.horas = Math.floor(durationInSeconds / 3600);
          this.minutos = Math.floor((durationInSeconds % 3600) / 60);
          this.segundos = durationInSeconds % 60;
  
          this.nuevaCancion.titulo = file.name.split('.').slice(0, -1).join('.');
        };
      }
    }
  }
  loadGeneros() {
    this.generosService.getGeneros().subscribe(
      (data) => {
        this.generosDisponibles = data;
      },
      (error) => {
        console.error("Error al cargar los géneros:", error);
      },
    );
  }

  loadAlbumsByArtistId(artistId: number) {
    this.albumsService.getAlbumsByUserId(artistId).subscribe(
      (response) => {
        if (response && response.albums) {
          this.albumsDisponibles = response.albums;
        } else {
          this.albumsDisponibles = [];
          console.warn("No se encontraron álbumes para este artista.");
        }
      },
      (error) => {
        console.error("Error al cargar los álbumes del artista:", error);
      },
    );
  }

  loadArtistas() {
    this.usuarioService.getArtists().subscribe(
      (data) => {
        this.artistasDisponibles = data;
        this.artistasFiltrados = data;
      },
      (error) => {
        console.error("Error al cargar los artistas:", error);
      },
    );
  }

  loadColaboradores() {
  this.usuarioService.getArtists().subscribe(
    (data) => {
      this.artistasDisponibles = data.filter(artista => artista.id !== this.nuevaCancion.artista_id);
    },
    (error) => {
      console.error("Error al cargar los artistas:", error);
    });
  }

  toggleColaborador(artista: any) {
    const index = this.colaboradoresSeleccionados.indexOf(artista.id);
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


  filterArtistas(event: any) {
    const query = event.target.value.toLowerCase();
    this.artistasFiltrados = this.artistasDisponibles.filter((artista) =>
      artista.nombre.toLowerCase().includes(query),
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
    this.nuevaCancion.artista_id = artista.id;

    this.loadAlbumsByArtistId(artista.id);
    this.showArtistas = false;
  }

  toggleGenre(genre: any) {
    const index = this.generosSeleccionados.indexOf(genre.id);
    if (index === -1) {
      this.generosSeleccionados.push(genre.id);
    } else {
      this.generosSeleccionados.splice(index, 1);
    }
  }

  calcularDuracionEnSegundos(): number {
    return this.horas * 3600 + this.minutos * 60 + this.segundos;
  }

  crearCancion(): void {
    const formData = new FormData();
  
    formData.append("artista_id", this.nuevaCancion.artista_id.toString());
    formData.append("album_id", this.nuevaCancion.album.toString());
    this.generosSeleccionados.forEach((generoId: number) => {
      formData.append("generos", generoId.toString());
    });
  
    if (this.selectedFiles) {
      formData.append("titulo", this.nuevaCancion.titulo);
      formData.append("duracion", this.calcularDuracionEnSegundos().toString());
    }
  
    this.selectedFiles.forEach((file) => {
      formData.append("archivo", file);
    });

    this.colaboradoresSeleccionados.forEach((colaboradorId) => {
      formData.append("colaboradores", colaboradorId.toString());
    });
  
    this.cancionesService.createCancion(formData).subscribe(
      (response) => {
        this.ref.close();
      },
      (error) => {
        console.error("Error al añadir las canciones:", error);
      }
    );
  }

  crearAlbum() {  }
}
