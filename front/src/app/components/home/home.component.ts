import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';
import { Playlist } from '../../interfaces/playlist';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchTerm: string = '';
  playlists: Playlist[] = [];
  userId: number | null = null;

  artists: string[] = ['Artista 1', 'Artista 2', 'Artista 3', 'Artista 4'];
  albumes: string[] = ['album1', 'album 2', 'album 3', 'album 4'];
  listas: string[] = ['lista 1', 'lista 2', 'lista 3', 'lista 4'];
  
  constructor(private router: Router, private authService: AuthService, private playlistService: PlaylistService, private usuarioService: UserService){}

  ngOnInit() {
    this.loadUserId();
  }

navigateToPlaylist(playlist: Playlist) {
  const playlistName = encodeURIComponent(playlist.nombre); // Codifica el nombre para la URL
  this.router.navigate([`/playlist/${playlist.id}/${playlistName}`]); // Navega usando el ID y el nombre
}

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  
  searchArtists() {
    console.log('Buscando:', this.searchTerm);
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

}
