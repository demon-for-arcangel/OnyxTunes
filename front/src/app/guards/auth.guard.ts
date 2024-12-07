import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const token = localStorage.getItem("user");

  console.log(token);

  if (token) {
    return true; 
  } else {
    console.log("No token");
    router.navigate(['/login']); 
    return false; 
  }
};
