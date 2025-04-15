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

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    FormsModule,
    SidebarComponent,
    PlayerComponent,
    AccountButtonComponent,
    DialogModule
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
  displayPopup: boolean = false;

  dialogRef!: DynamicDialogRef;

  constructor(private router: Router, private authService: AuthService, private playlistService: PlaylistService, private usuarioService: UserService, private recommendationService: RecommendationService, private dialogService: DialogService) {}

  ngOnInit() {
    this.loadUserId();
  }

  navigateToPlaylist(playlist: Playlist) {
    const playlistName = encodeURIComponent(playlist.nombre);
    this.router.navigate([`/playlist/${playlist.id}/${playlistName}`]);
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

    if (tokenObject) {
      this.authService.getUserByToken(tokenObject).subscribe({
        next: (usuario: Usuario | undefined) => {
          if (usuario?.id) {
            this.userId = usuario.id;
            console.log(this.userId);
            this.fetchRecommendationOnLogin(this.userId);

            this.playlistService.getUserPlaylists(this.userId).subscribe(
              (response) => {
                console.log(response);
                if (response.success) {
                  this.playlists = response.data;
            
                  this.especialPlaylists = this.playlists.filter((playlist) =>
                    playlist.nombre.includes("Recomendación Diaria"),
                  );
                  this.userPlaylists = this.playlists.filter((playlist) =>
                    !playlist.nombre.includes("Recomendación Diaria"),
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
            console.error("Usuario no encontrado en el token");
            this.router.navigate(["/login"]);
          }
        },
        error: (err) => {
          console.error("Error al obtener el usuario desde el token:", err);
          this.router.navigate(["/login"]);
        },
      });
    } else {
      console.error("No se encontró el token.");
    }
  }

  crearPlaylist() {
    //por hacer
  }

  fetchRecommendationOnLogin(userId: number) {
    this.recommendationService.getRecommendationOnLogin(userId.toString()).subscribe((response) => {
      if (response.ok && response.songRecommendation) {
        this.recommendedSong = response.songRecommendation;
        this.openRecommendationPopup();
      } else {
        console.error("No se pudo obtener una recomendación:", response.msg);
      }
    });
  }

  openRecommendationPopup() {
    if (!this.recommendedSong) {
      console.error("No hay canción recomendada para mostrar.");
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

    // Cierra automáticamente el pop-up después de 10 segundos
    setTimeout(() => {
      if (this.dialogRef) {
        this.dialogRef.close();
      }
    }, 10000);
  }

  closePopup() {
    this.displayPopup = false;
  }
}