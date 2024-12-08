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

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, SidebarComponent, PlayerComponent],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.css'
})
export class PlaylistComponent {
  playlistId: number | null = null;
  playlist: Playlist | null = null;
  canciones: any[] = [];
  user: any;
  userLikes: number[] = [];

  @ViewChild(PlayerComponent) playerComponent!: PlayerComponent;
  
  constructor(private route: ActivatedRoute, private playlistService: PlaylistService, 
    private songService: SongService, private authService: AuthService,
    private likeService: LikesService) {}

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
    if(this.playerComponent) {
      this.playerComponent.playSong(cancion);
      this.addToHistory(cancion.id);
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
  console.log('ID del usuario:', this.user.id); // Verifica que el ID del usuario sea correcto

  // Verificar si el like existe antes de intentar eliminarlo
  this.likeService.getLikesByUserId(this.user.id).subscribe(
      (response) => {
          // Suponiendo que response.data es un array de likes
          const like = response.data.find(like => like.entidad_id === cancionId);
          if (like) {
              // Aquí usamos el ID del like para eliminarlo
              this.likeService.deleteLike(like.id).subscribe(
                  (response) => {
                      console.log('Like eliminado:', response);
                      this.userLikes = this.userLikes.filter(id => id !== cancionId);
                      this.canciones = this.canciones.filter(c => c.id !== cancionId); // Eliminar de la lista de canciones
                  },
                  (error) => {
                      console.error('Error al eliminar el like:', error);
                      // Aquí puedes mostrar un mensaje al usuario si es necesario
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
}