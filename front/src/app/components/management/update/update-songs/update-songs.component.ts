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
    generos: [], 
    portada: '',
  };
  generosDisponibles: any[] = [];
  artistas: any[] = [];
  selectedFile: File | null = null;

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

        this.cancion.portada = data.portadaURL || '';
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      console.log("Archivo seleccionado:", file);
      this.selectedFile = file;
      this.cancion.portada = URL.createObjectURL(file);
    } else {
      console.error("No se selecciono ningun archivo.")
    }
  }

  /* onSubmit(): void {
    this.cancionesService.updateCancion(this.cancionId, this.cancion).subscribe(
      (response) => {
        console.log('Canción actualizada:', response);
        this.router.navigate(['/songs']); 
      },
      (error) => {
        console.error('Error al actualizar la canción:', error);
      }
    );
  } */

    onSubmit(): void {
      const formData = new FormData();
      formData.append('titulo', this.cancion.titulo);
      formData.append('duracion', this.cancion.duracion);
      formData.append('artista_id', this.cancion.artista_id.toString());
  
      this.cancion.generos.forEach((genero: any, index: number) => {
        formData.append(`generos[${index}]`, genero);
      });
  
      if (this.selectedFile) {
        formData.append('portada', this.selectedFile, this.selectedFile.name);
      }
  
      this.cancionesService.updateCancion(this.cancionId, formData).subscribe(
        (response) => {
          console.log('Canción actualizada:', response);
/*           this.router.navigate(['/songs']); 
 */        },
        (error) => {
          console.error('Error al actualizar la canción:', error);
        }
      );
    }
}
