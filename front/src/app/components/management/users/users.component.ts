import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../interfaces/usuario';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogComponent } from '../../utils/dialog/dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { CreateUserComponent } from '../create/create-user/create-user.component';
import { Router } from '@angular/router';
import { DeleteConfirmationComponent } from '../../utils/delete-confirmation/delete-confirmation.component';
import { UpdateUserComponent } from '../update/update-user/update-user.component';
import { ShowUserComponent } from '../show/show-user/show-user.component';
import { UpdateUserRolsComponent } from '../update/update-user-rols/update-user-rols.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, DialogComponent, DialogModule, ConfirmDialogModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [DialogService]
})
export class UsersComponent {
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchQuery: string = '';
  showFilter: boolean = false;
  filterType: 'todos' | 'artistas' | 'administradores' | 'usuarios' = 'todos';
  private originalUsuarios: Usuario[] = [];

  paginatedUsuarios: Usuario[] = [];
  maxItems: number = 5;  
  currentPage: number = 1;
  totalPages: number = 0;

  ref: DynamicDialogRef | undefined;
  dialog: any;

  constructor(private userService: UserService, public dialogService: DialogService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }
  
  goBack() {
    this.router.navigate(['/platformManagement']);
  }

  loadUsuarios(): void {
    this.userService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.originalUsuarios = usuarios;
        this.usuarios = [...usuarios]; 
        this.totalPages = Math.ceil(this.usuarios.length / this.maxItems);
        this.updatePaginatedUsuarios();
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  newUser(){
    this.ref = this.dialogService.open(CreateUserComponent, {
      header: 'Agregar Nuevo Usuario',
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

  updatePaginatedUsuarios(): void {
    const start = (this.currentPage - 1) * this.maxItems;
    const end = start + this.maxItems;
    this.paginatedUsuarios = this.usuarios.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsuarios();
    }
  }
  
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
  
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  searchUsuarios(): void {
    if (this.searchQuery) {
      const allUsuarios = [...this.usuarios]; 
      this.usuarios = allUsuarios.filter(usuario =>
        usuario.nombre?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.loadUsuarios(); 
    }
    
    this.currentPage = 1; 
    this.totalPages = Math.ceil(this.usuarios.length / this.maxItems);
    this.updatePaginatedUsuarios();
  }

  showUsuario(usuario: Usuario): void {
    this.ref = this.dialogService.open(ShowUserComponent, {
      header: 'Ver Datos del Usuario',
      modal: true,
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
        usuarioId: usuario.id
      }
    });
  }

  editUsuario(usuario: Usuario): void {
    this.ref = this.dialogService.open(UpdateUserComponent, {
      header: 'Editar Usuario',
      modal: true,
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
        usuarioId: usuario.id
      }
    });
  }

  editRoles(usuario: Usuario): void {
    this.ref = this.dialogService.open(UpdateUserRolsComponent, {
      header: 'Editar Roles del Usuario',
      modal: true,
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
        usuarioId: usuario.id
      }
    });
  }

  deleteUsuario(userId: number): void {
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
        userId: userId
      }
    });
  
    this.ref.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.deleteUsuario(userId).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter(usuario => usuario.id !== userId);
            this.updatePaginatedUsuarios();
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
          }
        });
      }
    });
  }


  toggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filterType === 'todos') {
      this.usuarios = [...this.originalUsuarios]; 
      this.currentPage = 1;
      this.totalPages = Math.ceil(this.usuarios.length / this.maxItems);
      this.updatePaginatedUsuarios();
      return;
    }
  
    const rolMap: { [key: string]: string } = {
      'administradores': 'administrador',
      'usuarios': 'usuario',
      'artistas': 'artista'
    };
  
    const rolBuscado = rolMap[this.filterType];
  
    this.usuarios = this.originalUsuarios.filter(usuario =>
      usuario.roles?.some(rol => rol.nombre?.toLowerCase() === rolBuscado.toLowerCase())
    );
  
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.usuarios.length / this.maxItems);
    this.updatePaginatedUsuarios();
  }

  getRoles(roles: any[]): string {
    if (!roles || roles.length === 0) {
        return 'Sin rol';
    }
    return roles.map(role => role.nombre).join(', ');
}
}
