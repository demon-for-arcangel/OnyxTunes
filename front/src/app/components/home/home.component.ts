import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { PlaylistService } from "../../services/playlist.service";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { Usuario } from "../../interfaces/usuario";
import { Playlist } from "../../interfaces/playlist";
import { SidebarComponent } from "../utils/sidebar/sidebar.component";
import { PlaylistComponent } from "../playlist/playlist.component";
import { PlayerComponent } from "../player/player.component";
import { AccountButtonComponent } from "../utils/account-button/account-button.component";
import { RecommendationService } from "../../services/recommendation.service";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { DialogModule } from "primeng/dialog";
import { RecommendedSongComponent } from "../recommended-song/recommended-song.component";
import { SongService } from "../../services/song.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    FormsModule,
    SidebarComponent,
    PlayerComponent,
    AccountButtonComponent,
    DialogModule, RecommendedSongComponent,
    PlaylistComponent
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
  providers: [DialogService]
})
export class HomeComponent {
  searchTerm: string = "";
  especialPlaylists: Playlist[] = [];
  userPlaylists: Playlist[] = []; 
  playlists: Playlist[] = [];
  userId: number | null = null;
  menuOpen: boolean = false;
  artists: string[] = ["Artista 1", "Artista 2", "Artista 3", "Artista 4"];
  albumes: string[] = ["album1", "album 2", "album 3", "album 4"];
  listas: string[] = ["lista 1", "lista 2", "lista 3", "lista 4"];
  recommendedSong: any = null;
  cancionesNuevas: any[] = [];

  dialogRef!: DynamicDialogRef;

  constructor(private router: Router, private authService: AuthService, private playlistService: PlaylistService, private usuarioService: UserService, private recommendationService: RecommendationService, private dialogService: DialogService, private songService: SongService) {}

  ngOnInit() {
    this.loadUserId();
    this.loadCancionesNuevas();
  }

  scrollLeft(): void {
    const container = document.querySelector(".songs-container") as HTMLElement;
    if (container) {
      container.scrollLeft -= 200;
    }
  }

  scrollRight(): void {
    const container = document.querySelector(".songs-container") as HTMLElement;
    if (container) {
      container.scrollLeft += 200;
    }
  }

  navigateToPlaylist(playlist: Playlist) {
    const encodedData = btoa(`${playlist.id}:${playlist.nombre}`);
    this.router.navigate([`/playlist/${encodedData}`]);
  }

  navigateToSearch() {
    this.router.navigate(["/search"]);
  }

  menu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(route: string) {
    this.menuOpen = false;
    this.router.navigate([`/${route}`]);
  }

  navigateToSong(cancion: any): void {
    const songTitle = encodeURIComponent(cancion.titulo);
    this.router.navigate([`/song/${cancion.id}/${songTitle}`]);
  }  

  searchArtists() {
    //por hacer
    console.log("Buscando:", this.searchTerm);
  }

  loadUserId() {
    const tokenObject = localStorage.getItem("user");
    if (!tokenObject) {
        console.error("Token no encontrado, redirigiendo a login");
        this.router.navigate(["/login"]);
        return;
    }

    this.authService.getUserByToken(tokenObject).subscribe({
        next: (usuario: Usuario | undefined) => {
            if (usuario?.id) {
                this.userId = usuario.id;
                console.log("ID de usuario obtenido:", this.userId);

                // 🔹 Llamar a `loadDailyRecommendations()` solo cuando `userId` esté disponible
                console.log("🔹 Llamando a loadDailyRecommendations()...");
                this.loadDailyRecommendations();
                this.RecommendationOnLogin(this.userId);
                this.loadUserPlaylists();
            } else {
                console.error("Usuario no encontrado en el token");
                this.router.navigate(["/login"]);
            }
        },
        error: (err) => {
            console.error("Error al obtener el usuario desde el token:", err);
            this.router.navigate(["/login"]);
        }
    });
  }

  crearPlaylist() {
    //por hacer
  }

  RecommendationOnLogin(userId: number) {
    if (userId) {
      this.recommendationService.getRecommendationOnLogin(userId.toString()).subscribe({
        next: (response) => {
          console.log("Recomendaciones obtenidas:", response);

          if (!response.songRecommendation) {
            console.log("Las recomendaciones están deshabilitadas o no hay una recomendación disponible.");
            return;
          }

          this.recommendedSong = response;
          this.openRecommendedSongDialog();
        },
        error: (error) => {
          console.error("Error al obtener recomendaciones:", error);
        }
      });
    } else {
      console.error("ID de usuario no encontrado");
    }
  }

  loadDailyRecommendations() {
    if (this.userId) {
        console.log("🔹 Ejecutando loadDailyRecommendations con userId:", this.userId);

        this.recommendationService.getDailyRecommendations(this.userId.toString()).subscribe({
            next: (response) => {
                console.log("✅ Respuesta antes de asignar:", response);

                this.especialPlaylists = response;
                console.log("✅ Estado de especialPlaylists después de asignar:", this.especialPlaylists);
            },
            error: (error) => {
                console.error("🚨 Error al obtener recomendaciones diarias:", error);
            }
        });
    } else {
        console.error("❌ ID de usuario no encontrado, no se ejecuta loadDailyRecommendations.");
    }
}


  openRecommendedSongDialog() {
    if (!this.recommendedSong) {
        console.log("No hay canción recomendada, el modal no se abrirá.");
        return; // Evita abrir el modal
    }

    this.dialogRef = this.dialogService.open(RecommendedSongComponent, {
      header: "Tu recomendación del día",
      width: "40vw",
      styleClass: 'custom-modal',
      contentStyle: {
        'background-color': '#1e1e1e',
        'color': 'white',
        'border-radius': '8px',
        'padding': '20px'
      },
      baseZIndex: 10000,
      style: {
        'background-color': '#1e1e1e',
      },
      closable: false,
      data: { recommendedSong: this.recommendedSong },
    });

    setTimeout(() => {
      if (this.dialogRef) {
        this.dialogRef.close();
      }
    }, 10000);
}
  loadCancionesNuevas(): void {
    this.songService.getCanciones().subscribe(
      (response) => {
        const ahora = new Date();
        const haceUnaSemana = new Date();
        haceUnaSemana.setDate(ahora.getDate() - 7); 
  
        this.cancionesNuevas = response.filter((cancion: any) => {
          const fechaCreacion = new Date(cancion.createdAt); 
          return fechaCreacion >= haceUnaSemana && fechaCreacion <= ahora;
        });
  
        console.log("Canciones nuevas de esta semana:", this.cancionesNuevas);
      },
      (error) => {
        console.error("Error al cargar canciones:", error);
      }
    );
  }

  loadUserPlaylists() {
    if (this.userId) {
      this.playlistService.getUserPlaylists(this.userId).subscribe(
        (response) => {
          console.log(response);
          if (response.success) {
            this.playlists = response.data;
            console.log("hola", this.playlists)
          } else {
            console.error("Error al obtener las playlists:", response.message);
          }
        },
        (error) => {
          console.error("Error en la solicitud:", error);
        },
      );
    } else {
      console.error("ID de usuario no encontrado");
    }
  }
}