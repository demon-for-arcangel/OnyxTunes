import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongService } from '../../../../services/song.service';
import { GeneroService } from '../../../../services/genero.service';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-update-songs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-songs.component.html',
  styleUrls: ['./update-songs.component.css']
})
export class UpdateSongsComponent implements OnInit {
  cancionId!: number; 
  cancion: any = {
    titulo: '',
    duracion: 0,
    artista_id: 0,
    generos: []
  };
  generosDisponibles: any[] = [];
  artistas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cancionesService: SongService,
    private generosService: GeneroService,
    private config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.cancionId = this.config.data.cancionId;
    console.log(this.cancionId);
    this.loadCancion(); 
    this.loadGeneros(); 
  }

  loadCancion(): void {
    this.cancionesService.getCancionById(this.cancionId).subscribe(
      (data) => {
        this.cancion = data; 
        console.log(this.cancion);
      },
      (error) => {
        console.error('Error al cargar la canción:', error);
      }
    );
  }

  loadGeneros(): void {
    this.generosService.getGeneros().subscribe(
      (data) => {
        this.generosDisponibles = data; 
      },
      (error) => {
        console.error('Error al cargar los géneros:', error);
      }
    );
  }

  onSubmit(): void {
    this.cancionesService.updateCancion(this.cancionId, this.cancion).subscribe(
      (response) => {
        console.log('Canción actualizada:', response);
        this.router.navigate(['/songs']); 
      },
      (error) => {
        console.error('Error al actualizar la canción:', error);
      }
    );
  }
}
