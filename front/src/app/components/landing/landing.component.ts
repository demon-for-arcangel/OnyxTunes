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

@Component({
  selector: "app-home",
  standalone: true,
  imports: [FormsModule, SidebarComponent],
  templateUrl: "./landing.component.html",
  styleUrl: "./landing.component.css",
})
export class LandingComponent {
  searchTerm: string = "";
  topCanciones: any[] = [];
  topAlbums: any[] = [];
  topPlaylists: any[] = [];
  topArtists: any[] = [];

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
    this.loadTopArtists(10);
  }

  loadTopReproducciones(limit: number) {
    this.reproduccionesService.getTopReproducciones(limit).subscribe(
      (data) => {
        this.topCanciones = data.canciones;
        this.topAlbums = data.albums;
        this.topPlaylists = data.playlists;

        this.getCancionesTitle(this.topCanciones);
        this.getAlbumsTitle(this.topAlbums);
        this.getPlaylistsTitle(this.topPlaylists);
        console.log(
          "Top canciones:",
          this.topCanciones,
          "Top albums:",
          this.topAlbums,
          "Top playlists:",
          this.topPlaylists,
        );
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
        this.topArtists = data; // Asignar los artistas más seguidos
        console.log("Top artistas:", this.topArtists);
      },
      (error) => {
        console.error("Error al obtener los artistas más seguidos:", error);
      },
    );
  }

  getCancionesTitle(canciones: any[]) {
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
  }

  getAlbumsTitle(albums: any[]) {
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
  }

  searchArtists() {
    this.router.navigate(["/search"]);
  }

  goToLogin() {
    this.router.navigate(["/login"]);
  }

  goToRegister() {
    this.router.navigate(["/register"]);
  }
}
