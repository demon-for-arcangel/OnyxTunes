import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Usuario } from '../../../interfaces/usuario';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../utils/dialog/dialog.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CreateArtistComponent } from '../create/create-artist/create-artist.component';

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [FormsModule, DialogComponent, DialogModule, ConfirmDialogModule],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css',
  providers: [DialogService]
})
export class ArtistsComponent {
  artistas: Usuario[] = [];
  filteredArtistas: Usuario[] = [];
  searchQuery: string = '';

  paginatedArtistas: Usuario[] = [];
  maxItems: number = 5;  
  currentPage: number = 1;
  totalPages: number = 0;

  ref: DynamicDialogRef | undefined;
  dialog: any;

  constructor(private userService: UserService, public dialogService: DialogService, private router: Router) {}

  ngOnInit(): void {
    this.loadArtistas();
  }

  newArtista(){
    this.ref = this.dialogService.open(CreateArtistComponent, {
      header: 'Agregar Nuevo Artista',
      modal: true,
      width: '60%',
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
      closeOnEscape: true
    });
  }

  goBack() {
    this.router.navigate(['/platformManagement']);
  }

  searchArtistas(): void {
    if (this.searchQuery) {
      const allArtistas = [...this.artistas]; 
      this.artistas = allArtistas.filter(artista =>
        artista.nombre?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.loadArtistas(); 
    }
    
    this.currentPage = 1; 
    this.totalPages = Math.ceil(this.artistas.length / this.maxItems);
    this.updatePaginatedArtistas();
  }

  loadArtistas(): void {
    this.userService.getArtists().subscribe({
      next: (artistas) => {
        this.artistas = artistas;
        console.log(this.artistas);
        this.totalPages = Math.ceil(this.artistas.length / this.maxItems);
        this.updatePaginatedArtistas();
      },
      error: (error) => {
        console.error('Error al cargar artistas:', error);
      }
    });
  }

  updatePaginatedArtistas(): void {
    const start = (this.currentPage - 1) * this.maxItems;
    const end = start + this.maxItems;
    this.paginatedArtistas = this.artistas.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedArtistas();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
  
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  editArtista(artista: Usuario): void {
    console.log('Editar artista:', artista);
  }

  deleteArtista(artistId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUsuario(artistId).subscribe({
        next: () => {
          this.artistas = this.artistas.filter(usuario => usuario.id !== artistId);
          this.artistas = this.artistas.filter(usuario => usuario.id !== artistId);
        },
        error: (error) => {
          console.error('Error al eliminar artista:', error);
        }
      });
    }
  }
}
