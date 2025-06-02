import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import { Usuario } from "../../interfaces/usuario";
import { AuthService } from "../../services/auth.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-platform-management",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./platform-management.component.html",
  styleUrl: "./platform-management.component.css",
})
export class PlatformManagementComponent {
  rol: string = "";

  constructor(
    private router: Router,
    private usuarioService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const tokenObject = localStorage.getItem("user");
    if (!tokenObject) {
      console.error("Token no encontrado, redirigiendo a login");
      this.router.navigate(["/login"]);
      return;
    }

    this.authService.getUserByToken(tokenObject).subscribe({
      next: (usuario: Usuario | undefined) => {
        if (usuario?.id) {
          this.getUsuario(usuario.id.toString());
        } else {
          console.error("Usuario no encontrado en el token");
          this.router.navigate(["/login"]);
        }
      },
      error: (err) => {
        console.error("Error al obtener el usuario desde el token:", err);
        this.router.navigate(["/login"]);
      },
    });
  }

  goBack() {
    this.router.navigate(["/selectAccess"]);
  }

  getUsuario(userId: string): void {
    this.usuarioService.getUserById(userId).subscribe({
      next: (usuario: Usuario) => {
        const roles = Array.isArray(usuario.Rol) ? usuario.Rol : [usuario.Rol];

        if (roles && roles.length > 0 && roles[0].nombre) {
          this.rol = roles[0].nombre;
        }
      },
      error: (err) => {
        console.error("Error al obtener los detalles del usuario por ID:", err);
        this.router.navigate(["/login"]);
      },
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([`/platform/${path}`]);
  }

  canAccess(section: string): boolean {
    const accessRules: { [key: string]: boolean } = {
      userManagement: this.rol === "Administrador",
      musicManagement: this.rol === "Administrador",
      artistManagement: this.rol === "Artista",
      genresManagement: this.rol === "Administrador",
    };

    return accessRules[section] ?? false;
  }
}
