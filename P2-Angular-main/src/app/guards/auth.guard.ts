import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Deja pasar si el usuario tiene al menos el nivel pedido (las categorías superiores incluyen a las inferiores)
export const nivelMinimo = (nivel: number): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.logueado()) return router.createUrlTree(['/login']);
  return auth.nivel() >= nivel ? true : router.createUrlTree(['/home']);
};
