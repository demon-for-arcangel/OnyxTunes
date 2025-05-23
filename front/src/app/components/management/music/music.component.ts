import { AfterViewInit, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SongService } from '../../../services/song.service';
import { AlbumsService } from '../../../services/albums.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ShowSongsComponent } from '../show/show-songs/show-songs.component';
import { CreateSongsComponent } from '../create/create-songs/create-songs.component';
import { UpdateSongsComponent } from '../update/update-songs/update-songs.component';
import { DeleteConfirmationComponent } from '../../utils/delete-confirmation/delete-confirmation.component';
import { UpdateAlbumsComponent } from '../update/update-albums/update-albums.component';
import { ShowAlbumsComponent } from '../show/show-albums/show-albums.component';
import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css'],
  providers: [DialogService]
})
export class MusicComponent implements OnInit, AfterViewInit {

  canciones: any[] = [];
  albums: any[] = [];
  currentCancionesPage = 1;
  cancionesPerPage = 5;
  currentAlbumsPage = 1;
  albumsPerPage = 5;
  searchQuery: string = '';
  mostrarCanciones: boolean = true;

  wavesurferInstances: { [key: number]: any } = {};
  ref: DynamicDialogRef | undefined;
  dialog: any;

  constructor(private router: Router, private cancionesService: SongService, public dialogService: DialogService, private albumsService: AlbumsService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadCanciones();
    this.loadAlbums();
  }

  ngAfterViewInit() {
    this.createWaveformsForVisibleSongs();
  }

  private createWaveformsForVisibleSongs() {
    this.paginatedCanciones.forEach(cancion => {
      if (!this.wavesurferInstances[cancion.id]) {
        this.createWaveform(cancion);
      }
    });
  }

  loadCanciones() {
    this.cancionesService.getCanciones().subscribe(
        (data) => {
            this.canciones = data; 
            this.cdr.detectChanges();
            this.createWaveformsForVisibleSongs();
        },
        (error) => {
            console.error('Error al cargar las canciones:', error);
        }
    );
  }

  createWaveform(cancion: any) {
    const containerId = `waveform-${cancion.id}`;
    
    let container = document.getElementById(containerId) as HTMLElement;
    if (!container) {
        const tr = document.querySelector(`tr[data-id="${cancion.id}"]`) as HTMLTableRowElement;
        if (tr) {
            const waveformDiv = document.createElement('div');
            waveformDiv.id = containerId;
            waveformDiv.style.width = '300px';  
            waveformDiv.style.height = '30px';  
            waveformDiv.style.marginRight = '10px';  
            
            const td = tr.querySelector('td:nth-child(4) > div') as HTMLDivElement;
            if (td) {
                td.appendChild(waveformDiv);
                container = waveformDiv;
            } else {
                return;
            }
        } else {
            return;
        }
    }

    if (!cancion.asset?.path) {
        return;
    }

    if (this.wavesurferInstances[cancion.id]) {
        this.wavesurferInstances[cancion.id].load(cancion.asset.path);
        return;
    }

    this.wavesurferInstances[cancion.id] = WaveSurfer.create({
        container: `#${containerId}`,
        waveColor: '#d9dcff',
        progressColor: '#e51d36',
        height: 30,
        barWidth: 1,
        normalize: true,
        backend: 'MediaElement'
    });

    this.wavesurferInstances[cancion.id].on('error', (error: Error) => {
        console.error(`Error en WaveSurfer para canción ${cancion.id}:`, error.message);
        if (this.wavesurferInstances[cancion.id]) {
            this.wavesurferInstances[cancion.id].destroy();
            delete this.wavesurferInstances[cancion.id];
        }
    });

    this.wavesurferInstances[cancion.id].on('loaderror', (error: Error) => {
        console.error(`Error al cargar el audio para canción ${cancion.id}:`, error.message);
        if (this.wavesurferInstances[cancion.id]) {
            this.wavesurferInstances[cancion.id].destroy();
            delete this.wavesurferInstances[cancion.id];
        }
    });

    this.wavesurferInstances[cancion.id].on('ready', () => {
        console.log(`WaveSurfer listo para canción ${cancion.id}`);
    });

    console.log('Cargando archivo de audio:', cancion.asset.path);
    this.wavesurferInstances[cancion.id].load(cancion.asset.path);
  }

  handlePageChange() {
    this.cdr.detectChanges();
    
    const currentPageIds = this.paginatedCanciones.map((c) => c.id);

    Object.keys(this.wavesurferInstances).forEach((id) => {
        if (!currentPageIds.includes(Number(id))) {
            console.log(`Destruyendo instancia de WaveSurfer para: ${id}`);
            this.wavesurferInstances[Number(id)].destroy();
            delete this.wavesurferInstances[Number(id)];
        }
    });

    this.paginatedCanciones.forEach(cancion => {
        if (this.wavesurferInstances[cancion.id]) {
            this.wavesurferInstances[cancion.id].load(cancion.asset.path);
        } else {
            this.createWaveform(cancion);
        }
    });
}

  isPlaying(cancionId: number): boolean {
    const wavesurfer = this.wavesurferInstances[cancionId];
    return wavesurfer ? wavesurfer.isPlaying() : false;
  }

  togglePlay(cancionId: number) {
    const wavesurfer = this.wavesurferInstances[cancionId];
    if (wavesurfer) {
      if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
      } else {
        wavesurfer.play();
      }
    }
  }

  view(){
    this.mostrarCanciones = !this.mostrarCanciones;
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

  getGenerosAlbums(album: any): string {
    if (!album.Cancions || album.Cancions.length === 0) {
        return 'Sin género';
    }

    const genreCount: Record<string, number> = {};

    album.Cancions.forEach((cancion: any) => {
        cancion.generos.forEach((genero: any) => {
            const genreName = genero.nombre;
            genreCount[genreName] = (genreCount[genreName] || 0) + 1;
        });
    });

    const dominantGenre = Object.keys(genreCount).reduce((a, b) => genreCount[a] > genreCount[b] ? a : b, '');

    return dominantGenre || 'Sin género';
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
        if (this.wavesurferInstances[cancion.id]) {
            this.wavesurferInstances[cancion.id].destroy();
            delete this.wavesurferInstances[cancion.id];
        }
    });
}

deleteSongs(id: number) {
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
          songsIds: [id]
      }
  });

  this.ref.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
          this.cancionesService.deleteCancion([id]).subscribe( 
              (response) => {
                  console.log('Canción eliminada:', response);
                  this.canciones = this.canciones.filter(c => c.id !== id);
              },
              (error) => {
                  console.error('Error al eliminar la canción', error);
              }
          );
      }
  }); 
}

  newAlbum() {
    const nuevoAlbum = { /* datos del nuevo álbum */ };
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
    this.ref = this.dialogService.open(UpdateAlbumsComponent, {
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
        albumId: album.id
      }
    });

    this.ref.onClose.subscribe(() => {
        this.loadCanciones(); 
    });
  }

  deleteAlbum(id: number) {
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
        songsIds: [id]
      }
    });

    this.ref.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.albumsService.deleteAlbum([id]).subscribe(
          (response) => {
            this.albums = this.albums.filter((a) => a.id !== id);
            console.log('Álbum eliminado:', response);
          },
          (error) => {
            console.error('Error al eliminar el álbum', error);
          }
        );
      }
    }); 
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
      this.handlePageChange();
    }
  }

  nextCancionesPage() {
    if (this.currentCancionesPage < this.totalCancionesPages) {
      this.currentCancionesPage++;
      this.handlePageChange();
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
    this.ref = this.dialogService.open(ShowAlbumsComponent, {
      header: 'Ver Datos del Album',
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
        albumId: album.id
      }
    });
  }
}