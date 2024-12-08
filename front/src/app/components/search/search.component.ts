import { Component, ViewChild } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { PlayerComponent } from '../player/player.component';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { SearchResults } from '../../interfaces/search-results';
import { AuthService } from '../../services/auth.service';
import { PlaylistService } from '../../services/playlist.service';
import { LikesService } from '../../services/likes.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [PlayerComponent, SidebarComponent, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  query: string = '';  
  results: SearchResults= {
    songs: [],
    playlists:[],
    artists:[],
    albums:[]
  };  
  songHovered: any = null;
  userId: number = 0;
  userLikes: number[] = [];

  @ViewChild(PlayerComponent) playerComponent!: PlayerComponent;

  constructor(private searchService: SearchService, private authService: AuthService, 
    private playlistService: PlaylistService, private likeService: LikesService) {
    this.getUserId();
  }

  getUserId() {
    const token = localStorage.getItem('user');
    this.authService.getUserByToken(token).subscribe(
      (user) => {
        console.log(user);
        if (user && user.id) { 
            this.userId = user.id;
            console.log(this.userId);
            this.getUserLikes();
        }
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  getUserLikes() {
    this.likeService.getLikesByUserId(this.userId).subscribe(
      (response) => { 
        console.log('Likes obtenidos:', response);
        if (Array.isArray(response.data)) { 
          this.userLikes = response.data.map(like => like.entidad_id); 
        } else {
          console.error('La respuesta no contiene un array en data:', response);
        }
      },
      (error) => {
        console.error('Error al obtener los likes del usuario:', error);
      }
    );
  }

  search() {
    if (this.query.trim()) {
      this.searchService.search(this.query).subscribe(
        (response) => {
          this.results = response;
          console.log(this.results);
        },
        (error) => {
          console.error('Error en la búsqueda:', error);
        }
      );
    }
  }

  playSong(song: any) {
    if(this.playerComponent) {
      this.playerComponent.playSong(song);
    }
  }

  addToFavorites(song: any) {
    const songId = song.id; 
    console.log(songId);
    console.log(this.userId);
    this.playlistService.addToFavorites(songId, this.userId).subscribe(
        (response) => {
            console.log('Canción añadida a favoritos:', response);
            this.userLikes.push(songId);
        },
        (error) => {
            console.error('Error al añadir la canción a favoritos:', error);
        }
    );
  }

  deleteLike(song: any) {
    const songId = song.id;
    const likeId = this.userLikes[songId]; // Obtiene el ID del like correspondiente

    if (likeId) {
      this.likeService.deleteLike(likeId).subscribe(
        (response) => {
          console.log('Like eliminado:', response);
          delete this.userLikes[songId]; // Elimina el like del objeto
        },
        (error) => {
          console.error('Error al eliminar el like:', error);
        }
      );
    } else {
      console.error('No se encontró el like para la canción:', songId);
    }
  }
}
