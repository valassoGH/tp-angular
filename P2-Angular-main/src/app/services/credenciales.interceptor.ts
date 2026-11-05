import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

// Envía la cookie de sesión de PHP en cada pedido y, si el servidor dice "sesión vencida", cierra la sesión local
export const credenciales: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req.clone({ withCredentials: true })).pipe(
    catchError(err => {
      if (err.status === 401 && !req.url.endsWith('login.php')) auth.cerrarLocal();
      return throwError(() => err);
    })
  );
};
