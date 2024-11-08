import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-platform-management',
  standalone: true,
  imports: [],
  templateUrl: './platform-management.component.html',
  styleUrl: './platform-management.component.css'
})
export class PlatformManagementComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([`/platform/${path}`]);
  }
}
