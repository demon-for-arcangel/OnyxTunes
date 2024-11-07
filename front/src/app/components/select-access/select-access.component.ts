import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-access',
  standalone: true,
  imports: [],
  templateUrl: './select-access.component.html',
  styleUrl: './select-access.component.css'
})
export class SelectAccessComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
