import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GeneroService } from '../../../services/genero.service';
import { DeleteConfirmationComponent } from '../../utils/delete-confirmation/delete-confirmation.component';
import { CreateGenresComponent } from '../create/create-genres/create-genres.component';
import { UpdateGenresComponent } from '../update/update-genres/update-genres.component';
import { ShowGenresComponent } from '../show/show-genres/show-genres.component';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css',
  providers: [DialogService]
})
export class GenresComponent {

  generos: any[] = [];
  currentGenerosPage = 1;
  generosPerPage = 5;
  searchQuery: string = '';
  mostrarGeneros: boolean = true;

  ref: DynamicDialogRef | undefined;
  dialog: any;

  constructor(private router: Router, private genresService: GeneroService, public dialogService: DialogService) { }

  ngOnInit() {
    this.loadGeneros();
  }

  loadGeneros() {
    this.genresService.getGeneros().subscribe(
      (data) => {
        this.generos = data;
        console.log('Generos cargados:', this.generos);
      },
      (error) => {
        console.error('Error al cargar los generos:', error);
      }
    );
  }

  newGenero() {
    this.ref = this.dialogService.open(CreateGenresComponent, {
      header: 'Crear Nuevo Genero',
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
        'background-color': '#1e1e1e',
      },
      showHeader: true,
      closable: true,
      closeOnEscape: true,
    });

    this.ref.onClose.subscribe(() => {
      this.loadGeneros();
    })
  }

  editGenero(genero: any) {
    this.ref = this.dialogService.open(UpdateGenresComponent, {
      header: 'Editar Genero',
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
        'background-color': '#1e1e1e',
      },
      showHeader: true,
      closable: true,
      closeOnEscape: true,
      data: {
        generoId: genero.id
      }
    })
  }

  deleteGenero(id: number) {
    console.log(id)
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
          this.genresService.deleteGenero([id]).subscribe(
            (data) => {
              console.log('Genero eliminado:', data);
              this.loadGeneros();
            },
            (error) => {
              console.error('Error al eliminar el genero:', error);
            }
          );
        }
    });
  }

  showGenero(genero: any) { 
    console.log("Genero seleccionado:", genero);
    this.ref = this.dialogService.open(ShowGenresComponent, {
      header: 'Información del Genero',
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
        'background-color': '#1e1e1e',
      },
      showHeader: true,
      closable: true,
      closeOnEscape: true,
      data: {
        generoId: genero.id
      }
    });
   }

  view() {
    this.mostrarGeneros = !this.mostrarGeneros;
  }

  goBack() {
    this.router.navigate(['/platformManagement']);
  }

  get paginatedGeneros() {
    const start = (this.currentGenerosPage - 1) * this.generosPerPage;
    const end = start + this.generosPerPage;
    return this.generos.slice(start, end);
  }

  get totalGenerosPages(): number {
    return Math.ceil(this.generos.length / this.generosPerPage);
  }

  prevGenresPage() {
    if (this.currentGenerosPage > 1) {
      this.currentGenerosPage--;
    }
  }

  nextGenresPage() {
    if (this.currentGenerosPage < this.totalGenerosPages) {
      this.currentGenerosPage++;
    }
  }

  searchGenres() {

  }
}
