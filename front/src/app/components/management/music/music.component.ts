import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css'],
})
export class MusicComponent {

  constructor(private router: Router) { }
  // Datos para canciones
  canciones = [
    { id: 1, titulo: 'Song 1', artista: 'Artist 1', album: 'Album 1', duracion: '3:45', genero: 'Pop' },
    { id: 2, titulo: 'Song 2', artista: 'Artist 2', album: 'Album 2', duracion: '4:20', genero: 'Rock' },
    // Agrega más canciones003 según sea necesario
  ];
  currentCancionesPage = 1;
  cancionesPerPage = 5;
  get totalCancionesPages(): number {
    return Math.ceil(this.canciones.length / this.cancionesPerPage);
  }
  get paginatedCanciones() {
    const start = (this.currentCancionesPage - 1) * this.cancionesPerPage;
    const end = start + this.cancionesPerPage;
    return this.canciones.slice(start, end);
  }

  // Datos para álbumes
  albums = [
    { id: 1, titulo: 'Album 1', artista: 'Artist 1', anio: 2022, numCanciones: 10, genero: 'Pop' },
    { id: 2, titulo: 'Album 2', artista: 'Artist 2', anio: 2020, numCanciones: 8, genero: 'Rock' },
    // Agrega más álbumes según sea necesario
  ];
  currentAlbumsPage = 1;
  albumsPerPage = 5;
  get totalAlbumsPages(): number {
    return Math.ceil(this.albums.length / this.albumsPerPage);
  }
  get paginatedAlbums() {
    const start = (this.currentAlbumsPage - 1) * this.albumsPerPage;
    const end = start + this.albumsPerPage;
    return this.albums.slice(start, end);
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

  // Métodos de acciones para canciones
  newCancion() {
    console.log('Añadir nueva canción');
  }
  editCancion(cancion: any) {
    console.log('Editar canción:', cancion);
  }
  deleteCancion(id: number) {
    this.canciones = this.canciones.filter((c) => c.id !== id);
    console.log('Canción eliminada:', id);
  }
  showCancion(cancion: any) {
    console.log('Ver detalles de canción:', cancion);
  }

  // Métodos de acciones para álbumes
  newAlbum() {
    console.log('Añadir nuevo álbum');
  }
  editAlbum(album: any) {
    console.log('Editar álbum:', album);
  }
  deleteAlbum(id: number) {
    this.albums = this.albums.filter((a) => a.id !== id);
    console.log('Álbum eliminado:', id);
  }
  showAlbum(album: any) {
    console.log('Ver detalles de álbum:', album);
  }

  // Búsqueda en canciones y álbumes
  searchQuery: string = '';
  searchMusic() {
    const query = this.searchQuery.toLowerCase();
    this.canciones = this.canciones.filter(
      (c) =>
        c.titulo.toLowerCase().includes(query) ||
        c.artista.toLowerCase().includes(query) ||
        c.album.toLowerCase().includes(query)
    );
    this.albums = this.albums.filter(
      (a) =>
        a.titulo.toLowerCase().includes(query) ||
        a.artista.toLowerCase().includes(query) ||
        a.genero.toLowerCase().includes(query)
    );
    console.log('Búsqueda realizada:', query);
  }

  goBack() {
    this.router.navigate(['/platformManagement']);
  }
}
