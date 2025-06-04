import { Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from '../../interfaces/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../utils/sidebar/sidebar.component';
import { PlayerComponent } from '../player/player.component';
import { SongService } from '../../services/song.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { LikesService } from '../../services/likes.service';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';
import { AccountButtonComponent } from '../utils/account-button/account-button.component';
import { ReproduccionesService } from '../../services/reproducciones.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    PlayerComponent,
    AccountButtonComponent
  ],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css',
})
export class PlaylistComponent {
  @Input() playlist!: Playlist;
  playlistId: number | null = null;
  canciones: any[] = [];
  user: any;
  userLikes: number[] = [];
  currentSongIndex: number = 0;

  @ViewChild(PlayerComponent) playerComponent!: PlayerComponent;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private songService: SongService,
    private authService: AuthService,
    private likeService: LikesService,
    private playerService: PlayerService,
    private reproduccionesService: ReproduccionesService
  ) { }

  ngOnInit(): void {
    this.initializePlaylist();
    const token = localStorage.getItem('user'); 
    if (token) {
      this.authService.getUserByToken(token).subscribe(
        (response: any) => {
          this.user = response; 
        },
        (error: any) => {
          console.error('Error al obtener el usuario:', error);
        }
      );
    }
  }

  initializePlaylist(): void {
    if (this.playlist) {
      this.playlistId = this.playlist.id;
      this.loadPlaylistDetails(this.playlistId);
    } else {
      this.route.params.subscribe(params => {
        const encodedData = params['data']; 
        const decodedData = atob(encodedData); 
        const [id, nombre] = decodedData.split(':'); 
        this.playlistId = +id; 
        this.loadPlaylistDetails(this.playlistId);
      });
    }
  }

  loadPlaylistDetails(id: number): void {
    this.playlistService.getPlaylistById(id).subscribe(
      (response: any) => {
        if (response) {
          this.playlist = response;
          this.canciones = response.canciones;
        } else {
          console.error('Error al obtener los detalles de la playlist:', response?.message || 'Respuesta no válida');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  reproducirCancion(cancion: any): void {
    if (!cancion || !this.canciones) return;
    const songIndex = this.canciones.findIndex((s: any) => s.id === cancion.id);
    if (songIndex !== -1) {
      this.playerService.setQueue(this.canciones);
      this.playerService.playFromIndex(songIndex);

      if (this.user) {
        this.reproduccionesService.createUpdateReproduccion(this.user.id, cancion.id, 'cancion').subscribe(
          (response: any) => {
            this.addToHistory(cancion.id);
          },
          (error: any) => {
            console.error('Error al crear la reproducción:', error);
          }
        );
      }
    }
  }

  addToHistory(cancionId: number): void {
    if (!this.user) return;
    this.songService.addToHistory(cancionId, this.user.id).subscribe(
      (response: any) => {      },
      (error: any) => {
        console.error('Error al añadir al historial:', error);
      }
    );
  }

  eliminarCancion(cancionId: number): void {
    if (!this.user) return;
    this.likeService.getLikesByUserId(this.user.id).subscribe(
      (response: any) => {
        const like = response.data.find((like: any) => like.entidad_id === cancionId);
        if (like) {
          this.likeService.deleteLike(like.id).subscribe(
            (response: any) => {
              this.userLikes = this.userLikes.filter(id => id !== cancionId);
              this.canciones = this.canciones.filter((c: any) => c.id !== cancionId);
            },
            (error: any) => {
              console.error('Error al eliminar el like:', error);
            }
          );
        }
      },
      (error: any) => {
        console.error('Error al obtener los likes del usuario:', error);
      }
    );
  }

  formatDuration(seconds: number): string {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  onSongEnded(): void {
    if (!this.playerComponent) return;
    this.currentSongIndex++;
    
    if (this.currentSongIndex >= this.canciones.length) {
      if (this.playerComponent.isLoop) {
        this.currentSongIndex = 0;
        this.reproducirCancion(this.canciones[0]);
      } else {
        this.currentSongIndex = 0;
      }
    } else {
      const nextSong = this.canciones[this.currentSongIndex];
      if (nextSong) {
        this.reproducirCancion(nextSong);
      }
    }
  }
}