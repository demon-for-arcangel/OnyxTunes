import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SongService } from '../../../../services/song.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-show-songs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './show-songs.component.html',
  styleUrl: './show-songs.component.css'
})
export class ShowSongsComponent {
  cancionId!: number;
  cancion: any; 

  constructor(
    private cancionesService: SongService, private config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.cancionId = this.config.data.cancionId; 
    if (this.cancionId) {
      this.loadCancionDetails(); 
    } else {
      console.error('No se proporcionó el usuarioId');
    }
  }

  loadCancionDetails(): void {
    this.cancionesService.getCancionById(this.cancionId).subscribe({
        next: (data) => {
            this.cancion = data; 
            console.log(this.cancion);
            if (!this.cancion.generos) {
                this.cancion.generos = [];
            }
        },
        error: (error) => {
            console.error('Error al cargar los detalles de la canción:', error);
        }
    });
}

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours > 0 ? hours + 'h ' : ''}${minutes}m ${secs}s`;
  }

  getGenerosString(generos: any[]): string {
    if (!generos || generos.length === 0) {
        return 'Sin géneros'; 
    }
    return generos.map(genero => genero.nombre).join(', ');
}

/* getGenerosString(generos: any[]): string {
    return generos.map(genero => genero.nombre).join(', ');
  } */
}
