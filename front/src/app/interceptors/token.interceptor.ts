import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Cambia 'user' a 'token' si el token se almacena bajo esa clave
  const tokenData = localStorage.getItem('user'); 
  let token;

  // Si el token está en formato JSON, parsea el objeto
  if (tokenData) {
    try {
      const parsedData = JSON.parse(tokenData);
      token = parsedData.token; // Asegúrate de que 'token' sea la clave correcta
    } catch (error) {
      console.error('Error al parsear el token:', error);
    }
  }

  console.log('Token a enviar:', token);

  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('x-token', token)
    });
    return next(clonedRequest); 
  }

  return next(req); 
};