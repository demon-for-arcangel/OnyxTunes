import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gustos-musicales',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './gustos-musicales.component.html',
  styleUrl: './gustos-musicales.component.css'
})
export class GustosMusicalesComponent {
  artistasPopulares = [
    { nombre: 'Artista 1', imagen: 'ruta-a-imagen1.jpg' },
    { nombre: 'Artista 2', imagen: 'ruta-a-imagen2.jpg' },
    { nombre: 'Artista 3', imagen: 'ruta-a-imagen3.jpg' },
  ];

  artistasSeleccionados: string[] = [];
  busqueda: string = '';

  get artistasFiltrados() {
    return this.artistasPopulares.filter(artista => 
      artista.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  seleccionarArtista(nombre: string) {
    if (!this.artistasSeleccionados.includes(nombre)) {
      if (this.artistasSeleccionados.length < 3) {
        this.artistasSeleccionados.push(nombre);
      } else {
        console.log('Solo puedes seleccionar un máximo de 3 artistas.');
      }
    } else {
      this.artistasSeleccionados = this.artistasSeleccionados.filter(artista => artista !== nombre);
    }
  }

  esArtistaSeleccionado(nombre: string) {
    return this.artistasSeleccionados.includes(nombre);
  }
}