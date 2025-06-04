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
  ngOnInit() {
    document.addEventListener("click", this.closeMenuOnClickOutside.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener("click", this.closeMenuOnClickOutside.bind(this));
  }

  closeMenuOnClickOutside(event: Event) {
    const menuElement = document.querySelector(".menu");
    const buttonElement = document.querySelector(".account-button");

    if (
      this.menuOpen &&
      menuElement &&
      buttonElement &&
      !menuElement.contains(event.target as Node) &&
      !buttonElement.contains(event.target as Node)
    ) {
      this.menuOpen = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
    this.menuOpen = false;
  }

  logout() {
    localStorage.removeItem('user');
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }
}
