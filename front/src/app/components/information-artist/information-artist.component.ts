import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';
import { PlayerComponent } from '../player/player.component';
import { AccountButtonComponent } from '../utils/account-button/account-button.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { AlbumsService } from '../../services/albums.service';

@Component({
  selector: 'app-information-artist',
  standalone: true,
  imports: [ CommonModule, SidebarComponent, PlayerComponent, AccountButtonComponent],
  templateUrl: './information-artist.component.html',
  styleUrl: './information-artist.component.css'
})
export class InformationArtistComponent {
  artistId !: number;
  artistData: any;
  songs: any[] = [];
  albums: any[] = [];

  constructor( private route: ActivatedRoute, private userService: UserService,
    private songService: SongService, private albumsService: AlbumsService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.artistId = params['artistId'];
      console.log('Artist ID:', this.artistId);
/*       this.getArtistData();
 */      this.getSongs();
      this.getAlbums();
    });
  }

/*   getArtistData() {
    this.userService.getUserById(this.artistId).subscribe(artist => {
        this.artistData = artist;
        console.log('Artist Data:', this.artistData);
    });
  } */


  getSongs() {
    this.songService.getCancionesByUser(this.artistId).subscribe(songs => {
      this.songs = songs;
      console.log('Songs:', this.songs);
    });
  }

  getAlbums() {
    this.albumsService.getAlbumsByUserId(this.artistId).subscribe(albums => {
        console.log('Albums:', albums); 
        this.albums = Array.isArray(albums) ? albums : [];
    });
  }

}
