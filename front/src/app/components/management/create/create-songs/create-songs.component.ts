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
  selectedFiles: File[] = []; // Almacenar múltiples archivos seleccionados
  user: any;
  userRol: string = ''

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
  
          // Asignar el rol del usuario
          if (this.user.Rol && Array.isArray(this.user.Rol)) {
            this.userRol = this.user.Rol[0].nombre; // Asumiendo que 'nombre' almacena el rol como 'Administrador' o 'Artista'
          } else if (this.user.Rol) {
            this.userRol = this.user.Rol.nombre;
          }
  
          // Si es artista, asignar automáticamente su nombre y ID
          if (this.userRol === "Artista") {
            this.nuevaCancion.artista = this.user.nombre;
            this.nuevaCancion.artista_id = this.user.id;
          }
  
          console.log("Usuario y Rol cargados:", this.user, this.userRol);
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
      this.selectedFiles = Array.from(input.files); // Convertir archivos a un array
  
      if (this.selectedFiles.length === 1) {
        // Caso: Solo un archivo seleccionado
        const file = this.selectedFiles[0];
        const fileURL = URL.createObjectURL(file);
        const audio = new Audio(fileURL);
  
        audio.onloadedmetadata = () => {
          const durationInSeconds = Math.floor(audio.duration);
          this.horas = Math.floor(durationInSeconds / 3600);
          this.minutos = Math.floor((durationInSeconds % 3600) / 60);
          this.segundos = durationInSeconds % 60;
  
          this.nuevaCancion.titulo = file.name.split('.').slice(0, -1).join('.'); // Asignar título
          console.log(`Duración de ${file.name}: ${this.horas}h ${this.minutos}m ${this.segundos}s`);
        };
      } else {
        // Caso: Múltiples archivos seleccionados
        this.nuevaCancion.titulo = ""; // Resetear título para múltiples archivos
        this.horas = 0;
        this.minutos = 0;
        this.segundos = 0;
        console.log(`${this.selectedFiles.length} archivos seleccionados`);
      }
    }
  }
  loadGeneros() {
    this.generosService.getGeneros().subscribe(
      (data) => {
        this.generosDisponibles = data;
        console.log("Generos disponibles:", this.generosDisponibles);
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
          console.log(
            "Álbumes disponibles para el artista:",
            this.albumsDisponibles,
          );
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
        console.log(data);
        console.log("Artistas disponibles:", this.artistasDisponibles);
      },
      (error) => {
        console.error("Error al cargar los artistas:", error);
      },
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
    console.log("Artista seleccionado:", artista);
    this.nuevaCancion.artista = artista.nombre;
    this.nuevaCancion.artista_id = artista.id;
    console.log("ID del artista asignado:", this.nuevaCancion.artista_id);

    this.loadAlbumsByArtistId(artista.id);
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
    return this.horas * 3600 + this.minutos * 60 + this.segundos;
  }

  crearCancion(): void {
    const formData = new FormData();
  
    // Agregar información general (se aplica a todos los archivos)
    formData.append("artista_id", this.nuevaCancion.artista_id.toString());
    formData.append("album_id", this.nuevaCancion.album.toString());
    this.nuevaCancion.generos.forEach((genero: number) => {
      formData.append("generos", genero.toString());
    });
  
    if (this.selectedFiles.length === 1) {
      // Subida única: Enviar título y duración
      formData.append("titulo", this.nuevaCancion.titulo);
      formData.append("duracion", this.calcularDuracionEnSegundos().toString());
    } else {
      // Subida múltiple: Backend se encarga de asignar títulos
      formData.append("duracion", "0"); // Duración no aplica
      formData.append("titulo", ""); // Sin título para múltiples archivos
    }
  
    // Agregar archivos al FormData
    this.selectedFiles.forEach((file) => {
      formData.append("archivo", file);
    });
  
    // Enviar al backend
    this.cancionesService.createCancion(formData).subscribe(
      (response) => {
        console.log("Canciones añadidas:", response);
        this.ref.close();
      },
      (error) => {
        console.error("Error al añadir las canciones:", error);
      }
    );
  }

  crearAlbum() {
    console.log("Crear álbum");
  }
}
