import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../interfaces/usuario';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { CreateUserComponent } from '../create/create-user/create-user.component';
import { Router } from '@angular/router';
import { DeleteConfirmationComponent } from '../../utils/delete-confirmation/delete-confirmation.component';
import { UpdateUserComponent } from '../update/update-user/update-user.component';
import { ShowUserComponent } from '../show/show-user/show-user.component';
import { RolService } from '../../../services/rol.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, DialogModule, ConfirmDialogModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [DialogService]
})
export class UsersComponent {
  user: Usuario[] = [];
  usuarios: any;
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

  constructor(private userService: UserService, public dialogService: DialogService, private router: Router, private rolService: RolService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }
  
  goBack() {
    this.router.navigate(['/platformManagement']);
  }

  loadUsuarios(): void {
    this.userService.indexUsuarios().subscribe({
      next: (usuarios) => {
        const usuariosConRoles = usuarios.map((usuario: Usuario) => {
          const rolId = usuario.rol;
          if (rolId !== undefined) { 
            this.rolService.getRolesById(rolId).subscribe({
              next: (rol) => {
                usuario.rolNombre = rol.nombre;
              },
              error: (error) => console.error(`Error al cargar el rol para el usuario ${usuario.id}:`, error),
            });
          } else {
            console.error(`El usuario ${usuario.id} no tiene rol asignado.`);
          }
          return usuario;
        });
        this.originalUsuarios = usuariosConRoles;
        this.usuarios = [...usuariosConRoles];
        this.totalPages = Math.ceil(this.usuarios.length / this.maxItems);
        this.updatePaginatedUsuarios();
      },
      error: (error) => console.error('Error al cargar usuarios:', error),
    });
  }
  

  getRolNombre(rolId: number): string | undefined {
    if (!rolId) {
      console.error('El usuario no tiene un rol asociado.');
      return undefined;
    }
  
    let rolNombre: string | undefined;
    this.rolService.getRolesById(rolId).subscribe({
      next: (rol) => {
        rolNombre = rol.nombre; 
      },
      error: (error) => {
        console.error('Error al obtener el rol:', error);
      }
    });
  
    return rolNombre;
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

    this.ref.onClose.subscribe((response) => {      
      if (response?.created === true) {
        this.loadUsuarios();
      }
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
        const allUsuarios = [...this.originalUsuarios]; 
        this.usuarios = allUsuarios.filter(usuario =>
            usuario.email?.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    } else {
        this.loadUsuarios(); 
    }
    
    this.currentPage = 1; 
    this.totalPages = Math.ceil(this.usuarios.length / this.maxItems);
    this.updatePaginatedUsuarios();
}

  showUsuario(usuario: Usuario): void {//revisar
    this.ref = this.dialogService.open(ShowUserComponent, {
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
        usuarioId: usuario.id
      }
    });
  }

  editUsuario(usuario: Usuario): void {
    this.ref = this.dialogService.open(UpdateUserComponent, {
      header: 'Editar Usuario',
      modal: true,
      width: '70vw',
      styleClass: 'custom-modal',
      contentStyle: {
        'background-color': '#1e1e1e',
        'color': 'white',
        'border-radius': '8px',
      },
      style: {
        'background-color': '#1e1e1e',
      },
      showHeader: true,
      closable: true,
      closeOnEscape: true,
      data: {
        usuarioId: usuario.id
      }
    });
  }

  deleteUsuario(userIds: number): void {
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
        userIds: userIds
      }
    });
  
    this.ref.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.deleteUsuarios([userIds]).subscribe({
          next: () => {
            this.user = this.user.filter(user => user.id !== userIds); 
            this.updatePaginatedUsuarios();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
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
    } else {
      const rolMap: { [key: string]: string } = {
        'administradores': 'Administrador',
        'usuarios': 'Usuario',
        'artistas': 'Artista'
      };
  
      const rolBuscado = rolMap[this.filterType];
      this.usuarios = this.originalUsuarios.filter(usuario => usuario.rolNombre === rolBuscado);
    }
  
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.usuarios.length / this.maxItems);
    this.updatePaginatedUsuarios();
  }
}
