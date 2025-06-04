import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { SidebarComponent } from "../utils/sidebar/sidebar.component";
import { ReproduccionesService } from "../../services/reproducciones.service";
import { SongService } from "../../services/song.service";
import { AlbumsService } from "../../services/albums.service";
import { PlaylistService } from "../../services/playlist.service";
import { SeguidoresService } from "../../services/seguidores.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [FormsModule, SidebarComponent, CommonModule],
  templateUrl: "./landing.component.html",
  styleUrl: "./landing.component.css",
})
export class LandingComponent {
  searchTerm: string = "";
  topCanciones: any[] = [];
  topAlbums: any[] = [];
  topPlaylists: any[] = [];
  topArtists: any[] = [];
  isPlayingMap: { [key: number]: boolean } = {};
  audio: HTMLAudioElement | null = null;
  audioPlayer: HTMLAudioElement | null = null;


  constructor(
    private router: Router,
    private reproduccionesService: ReproduccionesService,
    private songService: SongService,
    private albumsService: AlbumsService,
    private playlistsService: PlaylistService,
    private seguidoresService: SeguidoresService,
  ) {}

  ngOnInit() {
    this.loadTopReproducciones(5);
    this.loadTopArtists(5);
  }

  loadTopReproducciones(limit: number) {
    this.reproduccionesService.getTopReproducciones(limit).subscribe(
      (data) => {
        this.topCanciones = data.canciones;
        this.topAlbums = data.albums;
        this.topPlaylists = data.playlists;

/*         this.getCancionesTitle(this.topCanciones);
 */        /* this.getAlbumsTitle(this.topAlbums);
        this.getPlaylistsTitle(this.topPlaylists); */
      },
      (error) => {
        console.error(
          "Error al obtener las reproducciones más populares:",
          error,
        );
      },
    );
  }

  loadTopArtists(limit: number) {
    this.seguidoresService.getTopArtists(limit).subscribe(
      (data) => {
        this.topArtists = data; 
      },
/*       (error) => {
        console.error("Error al obtener los artistas más seguidos:", error);
      }, */
    );
  }

/*   getCancionesTitle(canciones: any[]) {
    canciones.forEach((cancion, index) => {
      this.songService.getCancionById(cancion.entidad_id).subscribe(
        (data) => {
          this.topCanciones[index].titulo = data.titulo;
        },
        (error) => {
          console.error(
            `Error al obtener el título de la canción con ID ${cancion.entidad_id}:`,
            error,
          );
        },
      );
    });
  } */

/*   getAlbumsTitle(albums: any[]) {
    albums.forEach((album, index) => {
      this.albumsService.getAlbumById(album.entidad_id).subscribe(
        (data) => {
          this.topAlbums[index].titulo = data.titulo;
        },
        (error) => {
          console.error(
            `Error al obtener el título del álbum con ID ${album.entidad_id}:`,
            error,
          );
        },
      );
    });
  }

  getPlaylistsTitle(playlists: any[]) {
    playlists.forEach((playlist, index) => {
      this.playlistsService.getPlaylistById(playlist.entidad_id).subscribe(
        (data) => {
          this.topPlaylists[index].nombre = data.nombre;
        },
        (error) => {
          console.error(
            `Error al obtener el nombre de la lista de reproducción con ID ${playlist.entidad_id}:`,
            error,
          );
        },
      );
    });
  } */

  searchArtists() {
    this.router.navigate(["/search"]);
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }

  goToRegister() {
    this.router.navigate(["/register"]);
  }

  scrollCarousel(direction: number, carouselClass: string): void {
  const carousel = document.querySelector(`.${carouselClass}`); 
  if (carousel instanceof HTMLElement) { 
    carousel.scrollBy({
      left: direction * 300,
      behavior: "smooth"
    });
  } else {
    console.error(`No se encontró el carrusel con clase: ${carouselClass}`);
  }
}


/*  isPlaying(songId: number): boolean {
  return this.isPlayingMap[songId] === true;
  }

playSong(songId: number, duration: number) {
  if (this.audioPlayer) {
    this.audioPlayer.pause();
    this.audioPlayer.src = ""; 
    this.audioPlayer.load(); 
    this.audioPlayer = null;
  }

  this.songService.getCancionById(songId).subscribe((data) => {
    if (!data.asset || !data.asset.path) {
      console.error(`La canción con ID ${songId} no tiene URL válida`);
      return;
    }

    this.audioPlayer = new Audio(data.asset.path);
    this.audioPlayer.play().then(() => {
      this.isPlayingMap[songId] = true;
    }).catch((error) => {
      console.error(`Error al reproducir canción con ID ${songId}`, error);
    });

    this.audioPlayer.onended = () => {
      this.resetAudioPlayer();
    };

    setTimeout(() => {
      this.resetAudioPlayer();
    }, duration * 1000);
  });
} */

/* resetAudioPlayer() {
  if (this.audioPlayer) {
    this.audioPlayer.pause();
    this.audioPlayer.src = "";
    this.audioPlayer.load();
    this.audioPlayer = null;
  }
  Object.keys(this.isPlayingMap).forEach(id => this.isPlayingMap[+id] = false);
} */

/* handleAudioEnd(event: Event) {
  const target = event.target as HTMLAudioElement;
  if (target) {
    target.pause();
    target.currentTime = 0;
    target.src = "";
  }

  this.audioPlayer = null;
} */

/* stopSong(songId: number) {
  this.resetAudioPlayer();
}

  getPreviewForPlaylistOrAlbum(id: number) {
    this.playlistsService.getPlaylistById(id).subscribe((data) => {
      if (!data.canciones || data.canciones.length === 0) {
        console.error(`Error: No hay canciones en la playlist/álbum con ID ${id}`);
        return;
      }

      const songs = data.canciones.slice(0, 3);

      songs.forEach((song: any) => {
        if (!song.url) {
          console.error(`Error: La canción ${song.titulo} no tiene URL válida`);
          return;
        }

        const audio = new Audio(song.url);
        audio.play().catch((error) => {
          console.error(`Error al reproducir la canción ${song.titulo}:`, error);
        });
      });
    });
  } */
}
