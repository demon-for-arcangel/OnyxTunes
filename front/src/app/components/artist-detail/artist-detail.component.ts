import { Component } from "@angular/core";
import { SidebarComponent } from "../utils/sidebar/sidebar.component";
import { PlayerService } from "../../services/player.service";
import { PlayerComponent } from "../player/player.component";
import { CommonModule } from "@angular/common";
import { Usuario } from "../../interfaces/usuario";
import { UserService } from "../../services/user.service";
import { ActivatedRoute } from "@angular/router";
import { SongService } from "../../services/song.service";
import { AlbumsService } from "../../services/albums.service";
import { SeguidoresService } from "../../services/seguidores.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-artist-detail",
  standalone: true,
  imports: [SidebarComponent, PlayerComponent, CommonModule],
  templateUrl: "./artist-detail.component.html",
  styleUrl: "./artist-detail.component.css",
})
export class ArtistDetailComponent {
  artist: Usuario | null = null;
  artistId!: number;
  songs: any[] = [];
  albums: any[] = [];
  isFollowing: boolean = false;
  user: Usuario | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private songService: SongService,
    private albumsService: AlbumsService,
    private seguidoresService: SeguidoresService,
    private playerService: PlayerService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.artistId = Number(this.route.snapshot.paramMap.get("id"));
  }

  getUser(): void {
    const token = localStorage.getItem("user");
    if (token) {
      this.authService.getUserByToken(token).subscribe({
        next: (response) => {
          this.user = response ?? null;
          this.loadArtistData();
          this.loadMusicData();
        },
        error: (error) => {
          console.error("Error al obtener el usuario:", error);
          this.user = null;
        },
        complete: () => {
          if (this.user) {
            this.checkFollowStatus();
          }
        },
      });
    } else {
      console.error("No se encontró un token en el almacenamiento local.");
      this.user = null;
    }
  }

  checkFollowStatus(): void {
    if (!this.user) {
      console.error("El usuario no está cargado.");
      return;
    }

    this.seguidoresService.getFollowing(this.user.id).subscribe({
      next: (following) => {
        if (Array.isArray(following) && following.length === 0) {
          this.isFollowing = false;
        } else {
          this.isFollowing = following.some(
            (follow: any) => follow.artista.id === this.artistId,
          );
        }
        console.log("Estado de seguimiento actualizado:", this.isFollowing);
      },
      error: (err) => {
        if (err.status === 404) {
          console.log("El usuario no sigue a ningún artista.");
          this.isFollowing = false;
        } else {
          console.error("Error al verificar artistas seguidos:", err);
        }
      },
    });
  }

  loadArtistData(): void {
    this.userService.getArtists().subscribe({
      next: (artists) => {
        this.artist =
          artists.find((artist) => artist.id === this.artistId) || null;
      },
      error: (err) => {
        console.error("Error al obtener los artistas:", err);
      },
    });
  }

  loadMusicData(): void {
    this.songService.getCancionesByUser(this.artistId).subscribe({
      next: (songs) => {
        this.songs = songs;
      },
      error: (err) => {
        console.error("Error al obtener las canciones:", err);
      },
    });

    this.albumsService.getAlbumsByUserId(this.artistId).subscribe({
      next: (albums) => {
        this.albums = albums;
      },
      error: (err) => {
        console.error("Error al obtener los álbumes:", err);
      },
    });
  }

  toggleFollowArtist(): void {
    if (!this.user) {
      console.error("El usuario no está cargado.");
      return;
    }

    if (this.isFollowing) {
      this.seguidoresService
        .removeFollower(this.artistId, this.user.id)
        .subscribe({
          next: () => {
            console.log("Dejaste de seguir al artista.");
            this.isFollowing = false;
          },
          error: (err) => {
            console.error("Error al dejar de seguir:", err);
          },
        });
    } else {
      this.seguidoresService
        .addFollower(this.artistId, this.user.id)
        .subscribe({
          next: () => {
            console.log("Ahora sigues al artista.");
            this.isFollowing = true;
          },
          error: (err) => {
            console.error("Error al seguir al artista:", err);
          },
        });
    }
  }

  playSong(song: any): void {
    console.log("Reproduciendo canción:", song.titulo);
  }

  playAllSongs(): void {
    console.log("Reproduciendo todas las canciones del artista:", this.songs);
  }

  showAllSongs(): void {
    console.log("Mostrar todas las canciones");
  }
}
