import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import 'internal-api';

export const startupGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  const isPackaged = await window.desktop.isPackaged();
  const argv = await window.desktop.argv();
  console.log('startupGuard', isPackaged, argv);

  return router.createUrlTree([ 'dashboard' ]);
};
