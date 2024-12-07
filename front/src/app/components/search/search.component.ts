import { Component, ViewChild } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { PlayerComponent } from '../player/player.component';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { SearchResults } from '../../interfaces/search-results';

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

  @ViewChild(PlayerComponent) playerComponent!: PlayerComponent;

  constructor(private searchService: SearchService) {}

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
}
