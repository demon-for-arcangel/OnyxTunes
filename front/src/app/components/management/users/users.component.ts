import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../interfaces/usuario';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchQuery: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.userService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.filteredUsuarios = usuarios;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  searchUsuarios(): void {
    if (this.searchQuery) {
      this.filteredUsuarios = this.usuarios.filter(usuario =>
        usuario.nombre?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredUsuarios = [...this.usuarios]; 
    }
  }

  editUsuario(usuario: Usuario): void {
    console.log('Editar usuario:', usuario);
  }

  deleteUsuario(userId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUsuario(userId).subscribe({
        next: () => {
          this.filteredUsuarios = this.filteredUsuarios.filter(usuario => usuario.id !== userId);
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== userId);
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }
}
