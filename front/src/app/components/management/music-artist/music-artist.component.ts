import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { SongService } from '../../../services/song.service';
import { Router } from '@angular/router';
import { ShowSongsComponent } from '../show/show-songs/show-songs.component';
import { UpdateSongsComponent } from '../update/update-songs/update-songs.component';
import { CreateSongsComponent } from '../create/create-songs/create-songs.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlbumsService } from '../../../services/albums.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../interfaces/usuario';
import { DeleteConfirmationComponent } from '../../utils/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-music-artist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './music-artist.component.html',
  styleUrl: './music-artist.component.css',
  providers: [DialogService]
})
export class MusicArtistComponent {

  user: any;
  canciones: any[] = [];
  albums: any[] = [];
  currentCancionesPage = 1;
  cancionesPerPage = 5;
  currentAlbumsPage = 1;
  albumsPerPage = 5;
  searchQuery: string = '';

  ref: DynamicDialogRef | undefined;
  dialog: any;

  constructor(private router: Router, private authService: AuthService, private cancionesService: SongService, public dialogService: DialogService, private albumsService: AlbumsService) { }

  ngOnInit() {
    this.loadCanciones();
    this.loadAlbums();
  }

  loadCanciones() {
    const tokenObject = localStorage.getItem('user'); 
    if (!tokenObject) {
        console.error('Token no encontrado, redirigiendo a login');
        this.router.navigate(['/login']);
        return;
    }

    this.authService.getUserByToken(tokenObject).subscribe(
        (usuario: Usuario | undefined) => {
            if (usuario) {
                this.user = usuario; 
                const userId = this.user.id; 
                this.cancionesService.getCancionesByUser(userId).subscribe(
                    (data) => {
                        this.canciones = data; 
                        console.log('Canciones cargadas:', this.canciones);
                    },
                    (err) => {
                        console.error('Error al cargar las canciones:', err);
                    }
                );
            } else {
                console.error('Usuario no encontrado en el token');
                this.router.navigate(['/login']);
            }
        },
        (err) => { 
            console.error('Error al obtener el usuario desde el token:', err);
            this.router.navigate(['/login']);
        }
    );
}

  loadAlbums() {
    this.albumsService.getAlbums().subscribe(
      (data) => {
        this.albums = data;
      },
      (error) => {
        console.error('Error al cargar los álbumes', error);
      }
    );
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${secs}s`;
  }

  getGenerosString(generos: any[]): string {
    return generos.map(genero => genero.nombre).join(', ');
  }

  newCancion() {
    this.ref = this.dialogService.open(CreateSongsComponent, {
        header: 'Añadir Nueva Canción',
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

    this.ref.onClose.subscribe(() => {
        this.loadCanciones(); 
    });
}

  editCancion(cancion: any) {
    this.ref = this.dialogService.open(UpdateSongsComponent, {
        header: 'Editar Canción',
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
        data: {
          cancionId: cancion.id
        }
    });

    this.ref.onClose.subscribe(() => {
        this.loadCanciones(); 
    });
}

deleteSongs(ids: number[]): void {
  const idsArray = Array.isArray(ids) ? ids : [ids]; 

  this.ref = this.dialogService.open(DeleteConfirmationComponent, {
    header: 'Confirmar Eliminación',
    width: '400px',
    modal: true,
    styleClass: 'custom-modal',
    contentStyle: {
      'background-color': '#1e1e1e',
      'color': 'white',
      'padding': '20px'
    },
    data: {
      songsIds: idsArray
    }
  });

  this.ref.onClose.subscribe((confirmed: boolean) => {
    if (confirmed) {
      this.cancionesService.deleteCancion(idsArray).subscribe( 
        (response) => {
          this.loadCanciones();
        },
        (error) => {
          console.error('Error al eliminar las canciones', error);
        }
      );
    }
  });
}

  newAlbum() {
    const nuevoAlbum = {  };
    this.albumsService.createAlbum(nuevoAlbum).subscribe(
      (response) => {
        console.log('Álbum añadido:', response);
        this.loadAlbums(); 
      },
      (error) => {
        console.error('Error al añadir el álbum', error);
      }
    );
  }

  editAlbum(album: any) {
    this.albumsService.updateAlbum(album).subscribe(
      (response) => {
        console.log('Álbum editado:', response);
        this.loadAlbums(); 
      },
      (error) => {
        console.error('Error al editar el álbum', error);
      }
    );
  }

  deleteAlbum(id: number) {
    this.albumsService.deleteAlbum(id).subscribe(
      (response) => {
        this.albums = this.albums.filter((a) => a.id !== id);
        console.log('Álbum eliminado:', id);
      },
      (error) => {
        console.error('Error al eliminar el álbum', error);
      }
    );
  }



  searchMusic() {
  }

  goBack() {
    this.router.navigate(['/platformManagement']);
  }

  get totalAlbumsPages(): number {
    return Math.ceil(this.albums.length / this.albumsPerPage);
  }

  get paginatedAlbums() {
    const start = (this.currentAlbumsPage - 1) * this.albumsPerPage;
    const end = start + this.albumsPerPage;
    return this.albums.slice(start, end);
  }

  get totalCancionesPages(): number {
    return Math.ceil(this.canciones.length / this.cancionesPerPage);
  }

  get paginatedCanciones() {
    const start = (this.currentCancionesPage - 1) * this.cancionesPerPage;
    const end = start + this.cancionesPerPage;
    return this.canciones.slice(start, end);
  }

  prevAlbumsPage() {
    if (this.currentAlbumsPage > 1) {
      this.currentAlbumsPage--;
    }
  }

  nextAlbumsPage() {
    if (this.currentAlbumsPage < this.totalAlbumsPages) {
      this.currentAlbumsPage++;
    }
  }

  prevCancionesPage() {
    if (this.currentCancionesPage > 1) {
      this.currentCancionesPage--;
    }
  }

  nextCancionesPage() {
    if (this.currentCancionesPage < this.totalCancionesPages) {
      this.currentCancionesPage++;
    }
  }

  showCancion(cancion: any) {
    console.log('Ver detalles de canción:', cancion);
    this.ref = this.dialogService.open(ShowSongsComponent, {
      header: 'Ver Datos de la Canción',
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
      data: {
        cancionId: cancion.id
      }
    });
  }

  showAlbum(album: any) {
    console.log('Ver detalles de álbum:', album);
  }
}
