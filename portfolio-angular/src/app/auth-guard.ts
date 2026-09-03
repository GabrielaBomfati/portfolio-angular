import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);

  const logado = sessionStorage.getItem('logado');

  if (logado === 'true') {
    return true;
  }

  return router.parseUrl('/login');
};