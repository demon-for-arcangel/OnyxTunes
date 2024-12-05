import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-button',
  standalone: true,
  imports: [],
  templateUrl: './account-button.component.html',
  styleUrl: './account-button.component.css'
})
export class AccountButtonComponent {
  menuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
    this.menuOpen = false;
  }

  logout() {
    // Lógica para cerrar sesión
    console.log('Cerrando sesión');
  }
}
