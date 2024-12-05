import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from '../../../interfaces/playlist';
import { AuthService } from '../../../services/auth.service';
import { PlaylistService } from '../../../services/playlist.service';
import { Usuario } from '../../../interfaces/usuario';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  playlists: Playlist[] = [];
  userId: number | null = null;

  constructor(private router: Router, private authService: AuthService, private playlistService: PlaylistService) {}
  ngOnInit() {
    this.loadUserId();
  }

  navigateToHome() {
    this.router.navigate(['/home']); 
  }


  navigateToSearch() {
    this.router.navigate(['/search']);
  }
  navigateToPlaylist(playlist: Playlist) {
    const playlistName = encodeURIComponent(playlist.nombre);
    this.router.navigate([`/playlist/${playlist.id}/${playlistName}`]); 
  }

  loadUserId() {
    const tokenObject = localStorage.getItem('user'); 
    if (!tokenObject) {
      console.error('Token no encontrado, redirigiendo a login');
      this.router.navigate(['/login']);
      return;
    }

    if (tokenObject) {
        
        this.authService.getUserByToken(tokenObject).subscribe({
          next: (usuario: Usuario | undefined) => {
            if (usuario?.id) {
              this.userId = usuario.id
              console.log(this.userId)
              this.playlistService.getUserPlaylists(this.userId).subscribe(response => {
                console.log(response)
                if (response.success) {
                  this.playlists = response.data;
                } else {
                  console.error('Error al obtener las playlists:', response.message);
                }
              }, error => {
                console.error('Error en la solicitud:', error);
              });
            } else {
              console.error('Usuario no encontrado en el token');
              this.router.navigate(['/login']);
            }
          },
          error: (err) => {
            console.error('Error al obtener el usuario desde el token:', err);
            this.router.navigate(['/login']);
          }
        });
    } else {
        console.error('No se encontró el token.');
    }
  }

  addPlaylist() {//por hacer
    console.log('Añadir playlist');
    this.router.navigate(['/create-playlist']);
  }
}
