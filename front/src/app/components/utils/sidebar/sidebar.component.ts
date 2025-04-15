import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from '../../../interfaces/playlist';
import { AuthService } from '../../../services/auth.service';
import { PlaylistService } from '../../../services/playlist.service';
import { Usuario } from '../../../interfaces/usuario';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreatePlaylistComponent } from '../../management/create/create-playlist/create-playlist.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  providers: [DialogService]
})
export class SidebarComponent {
  playlists: Playlist[] = [];
  userId: number | null = null;
  ref: DynamicDialogRef | undefined;
  dialog: any;

  constructor(private router: Router, private authService: AuthService, private playlistService: PlaylistService, public dialogService: DialogService) {}
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
    const encodedData = btoa(`${playlist.id}:${playlist.nombre}`);
    this.router.navigate([`/playlist/${encodedData}`]);
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
                console.log(response);
                if (response.success) {
                  this.playlists = response.data.filter((playlist: Playlist) =>
                    !playlist.nombre.includes("Recomendación Diaria")
                  );
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

  addPlaylist() {
    console.log('Añadir playlist');

    this.ref = this.dialogService.open(CreatePlaylistComponent, {
      header: 'Añadir Nueva Playlist',
      modal: true,
      width: '70vw',
      styleClass: 'custom-modal',
      contentStyle: {
          'background-color': '#1e1e1e',
          'color': 'white',
          'border-radius': '8px',
          'padding': '20px'
      },
      baseZIndex: 10000,
      style: {
          'background-color': '#1e1e1e'
      },
      showHeader: true,
      closable: true,
      closeOnEscape: true,
  });
  }
}
