import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';
import { PlayerComponent } from '../player/player.component';
import { AccountButtonComponent } from '../utils/account-button/account-button.component';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { AlbumsService } from '../../services/albums.service';
import { SeguidoresService } from '../../services/seguidores.service';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../../services/auth.service';

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
  isFollowing: boolean = false;
  user: Usuario | null = null;
  userId: number | null = null;

  constructor( private route: ActivatedRoute, private userService: UserService,
    private songService: SongService, private albumsService: AlbumsService,
    private seguidoresService: SeguidoresService, private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        if (params['artistId']) {
            this.artistId = Number(params['artistId']);
            console.log('Artist ID:', this.artistId);
        } else {
            console.error("Error: No se recibió el ID del artista en los parámetros.");
        }
        this.getUser();
        this.getSongs();
        this.getAlbums();
    });
  }

getUser(): void {
    const token = localStorage.getItem("user");
    if (token) {
        this.authService.getUserByToken(token).subscribe({
            next: (response) => {
                this.user = response ?? null;

                this.userId = response?.id !== undefined ? response.id : null;

            },
            error: (error) => {
                console.error("Error al obtener el usuario:", error);
                this.user = null;
                this.userId = null; 
            },
        });
    } else {
        console.error("No se encontró un token en el almacenamiento local.");
        this.user = null;
        this.userId = null;
    }
}


  toggleFollowArtist(artistId: number | null): void {
    if (!artistId || !this.userId) {
        console.warn("No se ha podido seguir/dejar de seguir al artista. ID no válido.");
        return;
    }

    if (this.isFollowing) {
        this.seguidoresService.removeFollower(artistId, this.userId).subscribe({
            next: (response) => {
              this.isFollowing = false;
            },
            error: (error) => {
              console.error("Error al dejar de seguir al artista:", error);
            }
        });
    } else {
        this.seguidoresService.addFollower(artistId, this.userId).subscribe({
            next: (response) => {
              this.isFollowing = true;
            },
            error: (error) => {
              console.error("Error al seguir al artista:", error);
            }
        });
    }
}


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
