import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('user'); // O de donde estés almacenando el token

  if (token) {
    // Clona la solicitud y agrega el token a las cabeceras
    const clonedRequest = req.clone({
      headers: req.headers.set('x-token', token)
    });
    return next(clonedRequest); // Envía la solicitud clonada
  }

  return next(req); // Envía la solicitud original si no hay token
};