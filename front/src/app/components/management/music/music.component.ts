import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SongService } from '../../../services/song.service';
import { AlbumsService } from '../../../services/albums.service';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css'],
})
export class MusicComponent implements OnInit {

  canciones: any[] = [];
  albums: any[] = [];
  currentCancionesPage = 1;
  cancionesPerPage = 5;
  currentAlbumsPage = 1;
  albumsPerPage = 5;
  searchQuery: string = '';

  constructor(
    private router: Router,
    private cancionesService: SongService,
    private albumsService: AlbumsService
  ) { }

  ngOnInit() {
    this.loadCanciones();
    this.loadAlbums();
  }

  loadCanciones() {
    this.cancionesService.getCanciones().subscribe(
      (data) => {
        this.canciones = data;
      },
      (error) => {
        console.error('Error al cargar las canciones', error);
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

  // Métodos de navegación y acciones para canciones
  newCancion() {
    const nuevaCancion = { /* datos de la nueva canción */ };
    this.cancionesService.createCancion(nuevaCancion).subscribe(
      (response) => {
        console.log('Canción añadida:', response);
        this.loadCanciones(); // Recargar las canciones
      },
      (error) => {
        console.error('Error al añadir la canción', error);
      }
    );
  }

  editCancion(cancion: any) {
    this.cancionesService.updateCancion(cancion).subscribe(
      (response) => {
        console.log('Canción editada:', response);
        this.loadCanciones(); // Recargar las canciones
      },
      (error) => {
        console.error('Error al editar la canción', error);
      }
    );
  }

  deleteCancion(id: number) {
    this.cancionesService.deleteCancion(id).subscribe(
      (response) => {
        this.canciones = this.canciones.filter((c) => c.id !== id);
        console.log('Canción eliminada:', id);
      },
      (error) => {
        console.error('Error al eliminar la canción', error);
      }
    );
  }

  // Métodos para álbumes
  newAlbum() {
    const nuevoAlbum = { /* datos del nuevo álbum */ };
    this.albumsService.createAlbum(nuevoAlbum).subscribe(
      (response) => {
        console.log('Álbum añadido:', response);
        this.loadAlbums(); // Recargar los álbumes
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
        this.loadAlbums(); // Recargar los álbumes
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

  // Búsqueda en canciones y álbumes
  searchMusic() {
    // Implementa la búsqueda aquí si es necesario
  }

  goBack() {
    this.router.navigate(['/platformManagement']);
  }

  // Método para obtener el total de páginas de álbumes
  get totalAlbumsPages(): number {
    return Math.ceil(this.albums.length / this.albumsPerPage);
  }

  // Método para obtener los álbumes paginados
  get paginatedAlbums() {
    const start = (this.currentAlbumsPage - 1) * this.albumsPerPage;
    const end = start + this.albumsPerPage;
    return this.albums.slice(start, end);
  }

  // Método para obtener el total de páginas de canciones
  get totalCancionesPages(): number {
    return Math.ceil(this.canciones.length / this.cancionesPerPage);
  }

  // Método para obtener las canciones paginadas
  get paginatedCanciones() {
    const start = (this.currentCancionesPage - 1) * this.cancionesPerPage;
    const end = start + this.cancionesPerPage;
    return this.canciones.slice(start, end);
  }

  // Métodos de navegación para álbumes
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

  // Métodos de navegación para canciones
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

  // Métodos para mostrar detalles de canción y álbum
  showCancion(cancion: any) {
    console.log('Ver detalles de canción:', cancion);
  }

  showAlbum(album: any) {
    console.log('Ver detalles de álbum:', album);
  }
}