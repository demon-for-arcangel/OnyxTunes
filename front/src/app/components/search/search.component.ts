import { Component, ViewChild } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { PlayerComponent } from '../player/player.component';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { SearchResults } from '../../interfaces/search-results';
import { AuthService } from '../../services/auth.service';
import { PlaylistService } from '../../services/playlist.service';

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

  @ViewChild(PlayerComponent) playerComponent!: PlayerComponent;

  constructor(private searchService: SearchService, private authService: AuthService, private playlistService: PlaylistService) {
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
            console.error('Usuario no encontrado o ID no disponible.');
        }
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
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
        },
        (error) => {
            console.error('Error al añadir la canción a favoritos:', error);
        }
    );
}
}
