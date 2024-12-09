import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, SidebarComponent, PlayerComponent],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css',
})
export class PlaylistComponent {
  playlistId: number | null = null;
  playlist: Playlist | null = null;
  canciones: any[] = [];
  user: any;
  userLikes: number[] = [];
  currentSongIndex: number = 0;

  @ViewChild(PlayerComponent) playerComponent!: PlayerComponent;
  
  constructor(private route: ActivatedRoute, private playlistService: PlaylistService, 
    private songService: SongService, private authService: AuthService,
    private likeService: LikesService, private playerService: PlayerService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const encodedData = params['data']; 
      const decodedData = atob(encodedData); 
      const [id, nombre] = decodedData.split(':'); 
      this.playlistId = +id; 
      console.log('ID de la playlist:', this.playlistId);
      this.loadPlaylistDetails(this.playlistId);
    });

    const token = localStorage.getItem('user'); 
    if (token) {
      this.authService.getUserByToken(token).subscribe(
        response => {
          this.user = response; 
          console.log('Usuario obtenido:', this.user);
        },
        error => {
          console.error('Error al obtener el usuario:', error);
        }
      );
    }
  }

  loadPlaylistDetails(id: number) {
    this.playlistService.getPlaylistById(id).subscribe(response => {
      console.log(response);
      if (response) {
        this.playlist = response;
        this.canciones = response.canciones; 
        console.log('Playlist cargada:', this.playlist);
        console.log('Canciones:', this.canciones);
        console.log('titulo', response.canciones[0]?.titulo);
      } else {
        console.error('Error al obtener los detalles de la playlist:', response.message || 'Respuesta no válida');
      }
    }, error => {
      console.error('Error en la solicitud:', error);
    });
  }

  reproducirCancion(cancion: any) {
    const songIndex = this.canciones.findIndex((s) => s.id === cancion.id); 
    if (songIndex !== -1) {
      this.playerService.setQueue(this.canciones); 
      this.playerService.playFromIndex(songIndex); 
    } else {
      console.error('La canción no se encontró en la playlist.');
    }
  }

  addToHistory(cancionId: number) {
    if (this.user) { 
        console.log('ID de la canción:', cancionId);
        console.log('ID del usuario:', this.user.id);
        this.songService.addToHistory(cancionId, this.user.id).subscribe(response => {
            console.log('Canción añadida al historial:', response);
        }, error => {
            console.error('Error al añadir al historial:', error);
        });
    } else {
        console.error('No se pudo añadir al historial, usuario no encontrado.');
    }
}

eliminarCancion(cancionId: number) {
  console.log('ID de la playlist:', this.playlistId);
  console.log('ID de la canción a eliminar:', cancionId);
  console.log('ID del usuario:', this.user.id); 

  this.likeService.getLikesByUserId(this.user.id).subscribe(
      (response) => {
          const like = response.data.find(like => like.entidad_id === cancionId);
          if (like) {
              this.likeService.deleteLike(like.id).subscribe(
                  (response) => {
                      console.log('Like eliminado:', response);
                      this.userLikes = this.userLikes.filter(id => id !== cancionId);
                      this.canciones = this.canciones.filter(c => c.id !== cancionId); 
                  },
                  (error) => {
                      console.error('Error al eliminar el like:', error);
                  }
              );
          } else {
              console.error('El like no existe para esta canción.');
          }
      },
      (error) => {
          console.error('Error al obtener los likes del usuario:', error);
      }
  );
}

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = secs.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`; 
  }

  onSongEnded() {
    this.currentSongIndex++;
  
    if (this.currentSongIndex >= this.canciones.length) {
      if (this.playerComponent.isLoop) {
        this.currentSongIndex = 0;
        const nextSong = this.canciones[this.currentSongIndex];
        this.reproducirCancion(nextSong);
      } else {
        console.log('Fin de la lista de reproducción');
        this.currentSongIndex = 0; 
      }
    } else {
      const nextSong = this.canciones[this.currentSongIndex];
      this.reproducirCancion(nextSong);
    }
  }
  
}