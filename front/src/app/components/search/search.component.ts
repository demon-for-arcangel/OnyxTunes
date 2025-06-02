import { Component, ViewChild } from "@angular/core";
import { SearchService } from "../../services/search.service";
import { PlayerComponent } from "../player/player.component";
import { SidebarComponent } from "../utils/sidebar/sidebar.component";
import { FormsModule } from "@angular/forms";
import { SearchResults } from "../../interfaces/search-results";
import { AuthService } from "../../services/auth.service";
import { PlaylistService } from "../../services/playlist.service";
import { LikesService } from "../../services/likes.service";
import { PlayerService } from "../../services/player.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-search",
  standalone: true,
  imports: [PlayerComponent, SidebarComponent, FormsModule],
  templateUrl: "./search.component.html",
  styleUrl: "./search.component.css",
})
export class SearchComponent {
  query: string = "";
  results: SearchResults = {
    songs: [],
    playlists: [],
    artists: [],
    albums: [],
  };
  songHovered: any = null;
  userId: number = 0;
  userLikes: { id: number; entidad_id: number; entidad_tipo: string }[] = [];
  selectedFilter: string = "all";
  successMessage: string = "";

  @ViewChild(PlayerComponent) playerComponent!: PlayerComponent;

  constructor(
    private searchService: SearchService,
    private authService: AuthService,
    private playlistService: PlaylistService,
    private likeService: LikesService,
    private playerService: PlayerService,
  ) {
    this.getUserId();
  }

  viewArtist(id: number) {
    window.location.href = `/artist/${id}`;
  }

  getUserId() {
    const token = localStorage.getItem("user");
    this.authService.getUserByToken(token).subscribe(
      (user) => {
        if (user && user.id) {
          this.userId = user.id;
          this.getUserLikes();
        }
      },
      (error) => {
        console.error("Error al obtener el usuario:", error);
      },
    );
  }

  getUserLikes() {
  this.likeService.getLikesByUserId(this.userId).subscribe({
    next: (response) => {
      if (Array.isArray(response.data)) {
        // 🔹 Guardamos el objeto completo con `id`, `entidad_id` y `entidad_tipo`
        this.userLikes = response.data.map((like) => ({
          id: like.id,  // ID único del like (para eliminarlo)
          entidad_id: like.entidad_id,  // ID de la entidad (Canción, Álbum o Playlist)
          entidad_tipo: like.entidad_tipo, // Tipo de entidad (Cancion, Album, Playlist)
        }));

        console.log("✅ Likes cargados correctamente:", this.userLikes);
      } else {
        console.error("⚠ La respuesta no contiene un array en data:", response);
      }
    },
    error: (error) => {
      console.error("❌ Error al obtener los likes del usuario:", error);
    },
  });
}



search() {
  if (this.query.trim()) {
    this.searchService.search(this.query).subscribe({
      next: (response) => {
        console.log(" Datos recibidos en search():", response);

        if (response?.artists && Array.isArray(response.artists)) {
          console.log("Artistas encontrados:", response.artists);
          this.results.artists = response.artists;
        } else {
          console.warn("La API no devolvió artistas correctamente.");
          this.results.artists = [];
        }

        this.results.songs = response.songs ?? [];
        this.results.playlists = response.playlists ?? [];
        this.results.albums = response.albums ?? [];

        console.log("Resultados asignados al componente:", this.results);
      },
      error: (error) => {
        console.error("Error en la búsqueda:", error);
      }
    });
  }
}

  playSong(cancion: any) {
    this.playerService.playSong(cancion);
  }

addToFavorites(song: any) {
  const songId = song.id;
  this.playlistService.addToFavorites(songId, this.userId).subscribe({
    next: () => {
      this.userLikes.push({ id: songId, entidad_id: songId, entidad_tipo: "Cancion" });

      this.successMessage = "Canción añadida a favoritos.";
      setTimeout(() => {
        this.successMessage = "";
      }, 3000);
    },
    error: (error) => {
      console.error("Error al añadir la canción a favoritos:", error);
    },
  });
}

  hasLikedSong(songId: number): boolean {
    return this.userLikes.some(like => like.entidad_id === songId && like.entidad_tipo === 'Cancion');
  }


deleteLike(entidadId: number, tipo: string) {
  const likeToDelete = this.userLikes.find(
    (like) => like.entidad_id === entidadId && like.entidad_tipo === tipo
  );

  if (likeToDelete) {
    this.likeService.deleteLike(likeToDelete.id).subscribe({
      next: () => {
        this.successMessage = `${tipo} eliminado de favoritos.`;
        this.getUserLikes();
        setTimeout(() => {
          this.successMessage = "";
        }, 3000);
      },
      error: (error) => {
        console.error(`Error al eliminar el like para ${tipo} con ID ${entidadId}:`, error);
      },
    });
  } else {
    console.warn(`No se encontró un like para ${tipo} con ID ${entidadId}`);
  }
}


}
