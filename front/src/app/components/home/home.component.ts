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
import { LikesService } from "../../services/likes.service";
import { PlaylistfavoriteService } from "../../services/playlistfavorite.service";

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
  userId: number = 0; 
  usuarioEmail !: string;
  recommendationPlaylist: any = null;
  menuOpen: boolean = false;
  artists: string[] = ["Artista 1", "Artista 2", "Artista 3", "Artista 4"];
  albumes: string[] = ["album1", "album 2", "album 3", "album 4"];
  listas: string[] = ["lista 1", "lista 2", "lista 3", "lista 4"];
  recommendedSong: any = null;
  cancionesNuevas: any[] = [];
  isEnabled: boolean = false;
  genrePlaylists: Playlist[] = [];
  selectedSongId: number | null = null;
  selectedPlaylistId: number | null = null;
  userLikes: number[] = [];
  showPlaylists = false;
  targetPlaylistId: number | null = null;

  dialogRef!: DynamicDialogRef;

  constructor(private router: Router, private authService: AuthService, private playlistService: PlaylistService, 
    private usuarioService: UserService, private recommendationService: RecommendationService, 
    private dialogService: DialogService, private songService: SongService, private likeService: LikesService,
    private favoriteService: PlaylistfavoriteService
    ) {}

  ngOnInit() {
    this.loadUserId();
    this.loadCancionesNuevas();
  }

  goToArtistPage(artistId: string) {
    this.router.navigate(['/information-artist'], { queryParams: { artistId } });
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
          console.log("Usuario obtenido desde el token:", usuario)
            if (usuario?.id && usuario?.email) {
              this.usuarioEmail = usuario.email;
                this.userId = usuario.id;

              this.loadUserRecommendationPlaylist();
              this.loadUserPlaylists();

                this.checkRecommendationStatus();

                  if (this.isEnabled) {
                      console.log("Recomendaciones habilitadas, llamando a RecommendationOnLogin...");
                      this.RecommendationOnLogin(this.userId);
                  } else {
                      console.log("Recomendaciones deshabilitadas, no se ejecuta RecommendationOnLogin.");
                  }
            this.createPlaylistsByGenres()

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

loadUserRecommendationPlaylist() {
    this.recommendationService.getPlaylistByEmail(this.usuarioEmail).subscribe({
        next: (response) => {
            if (response.data) {
                this.recommendationPlaylist = (Array.isArray(response.data) ? response.data : [response.data])
                .map((playlist: Playlist) => ({
                    ...playlist, 
                  nombre: playlist.nombre.includes("Recomendación Diaria") ? "Recomendación Diaria" : playlist.nombre                }));
            } else {
              this.recommendationPlaylist = [];
              this.loadDailyRecommendations();
            }
        },
        error: (error) => {
          this.recommendationPlaylist = [];
        }
    });
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

  checkRecommendationStatus(): void {
    if (!this.userId) return;

    this.recommendationService.getRecommendationStatus(this.userId.toString()).subscribe({
      next: (status: boolean) => {
        this.isEnabled = status;
        console.log(this.isEnabled);
      },
      error: (err) => {
        console.error("Error al obtener el estado de recomendaciones:", err);
      }
    });
  }

  createPlaylistsByGenres(): void {
    this.playlistService.createPlaylistsByGenres().subscribe({
        next: (response) => {
            console.log("Playlists creadas correctamente:", response);
        },
        error: (error) => {
            console.error("Error al crear playlists por género:", error);
        }
    });
  }

  loadDailyRecommendations() {
      if (this.userId) {
          this.recommendationService.getDailyRecommendations(this.userId.toString()).subscribe({
              next: (response) => {
                  if (response && Array.isArray(response)) {
                      this.especialPlaylists = response;
                  } else {
                    this.especialPlaylists = response ? [response] : [];
                  }

                  this.loadUserRecommendationPlaylist();
              },
              error: (error) => {
                this.especialPlaylists = [];
              }
          });
      }
  }

  openRecommendedSongDialog() {
    if (!this.recommendedSong) {
        console.log("No hay canción recomendada, el modal no se abrirá.");
        return;
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
/*             this.playlists = response.data;
 */            console.log("hola", this.playlists)
                   this.playlists = response.data.filter((playlist: Playlist) =>
                    playlist.nombre.includes("Recomendación Diaria")
                  );
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

  toggleSongMenu(songId: number): void {
    if (this.selectedSongId === songId) {
      this.menuOpen = false;
      this.selectedSongId = null;
    } else {
      this.menuOpen = true;
      this.selectedSongId = songId;
    }
  }

  togglePlaylistMenu(playlistId: number): void {
    if (this.selectedPlaylistId === playlistId) {
      this.menuOpen = false;
      this.selectedPlaylistId = null;
      this.showPlaylists = false;

    } else {
      this.menuOpen = true;
      this.selectedPlaylistId = playlistId;
      this.showPlaylists = false;
      this.loadUserPlaylists();  
      this.getUserPlaylists(playlistId);
    }
  }

  toggleShowPlaylists(): void {
    if (!this.selectedPlaylistId) {
      console.warn("No se ha seleccionado una playlist origen.");
      return;
    }

    this.showPlaylists = !this.showPlaylists; 
    if (this.showPlaylists) {
      this.getUserPlaylists(this.selectedPlaylistId);
    }
  }

  addToFavorites(song: any) {
    const songId = song.id;
    console.log(songId);
    console.log(this.userId);
    this.playlistService.addToFavorites(songId, this.userId).subscribe(
      (response) => {
        console.log("Canción añadida a favoritos:", response);
        this.userLikes.push(songId);
      },
      (error) => {
        console.error("Error al añadir la canción a favoritos:", error);
      },
    );
  }

  deleteLike(song: any) {
    const songId = song.id;
    const likeId = this.userLikes[songId];

    if (likeId) {
      this.likeService.deleteLike(likeId).subscribe(
        (response) => {
          console.log("Like eliminado:", response);
          delete this.userLikes[songId];
        },
        (error) => {
          console.error("Error al eliminar el like:", error);
        },
      );
    } else {
      console.error("No se encontró el like para la canción:", songId);
    }
  }

  savePlaylist(playlistId: number): void {
    const usuarioId = this.userId;

    console.log("Guardando playlist con ID:", playlistId, "para el usuario con ID:", usuarioId);

    this.favoriteService.addFavoritePlaylist(usuarioId, playlistId).subscribe({
      next: (response) => {
        console.log("Playlist guardada en favoritos:", response);
      },
      error: (error) => {
        console.error("Error al guardar la playlist:", error);
      }
    });
  }

getUserPlaylists(sourcePlaylistId: number): void {
    this.playlistService.getUserPlaylists(this.userId).subscribe({
        next: (response) => {
            console.log("Datos recibidos de la API:", response);

            if (!response?.data || response.data.length === 0) {
                console.warn("No se recibieron playlists.");
                return;
            }

            this.userPlaylists = response.data.filter((p: Playlist) => p.id !== sourcePlaylistId);
            console.log("Playlists disponibles:", this.userPlaylists);
        },
        error: (error) => {
            console.error("Error al obtener playlists:", error);
        }
    });
}
  addSongsToPlaylist(sourcePlaylistId: number, targetPlaylistId: number): void {
    if (!targetPlaylistId) {
      console.warn("No se ha seleccionado una playlist destino.");
      return;
    }

    this.playlistService.addSongsToPlaylist(this.userId, sourcePlaylistId, targetPlaylistId).subscribe({
        next: (response) => {
            console.log("Canciones añadidas:", response.msg);
        },
        error: (error) => {
            console.error("Error al añadir canciones:", error);
        }
    });
  }

  selectTargetPlaylist(playlistId: number): void {
    this.targetPlaylistId = playlistId; 
    console.log(`Playlist destino seleccionada: ${playlistId}`);
  }

  confirmAddSongs(): void {
    if (!this.targetPlaylistId) {
        console.warn("No se ha seleccionado una playlist destino.");
        return;
    }

    this.addSongsToPlaylist(this.selectedPlaylistId!, this.targetPlaylistId);
  }

}