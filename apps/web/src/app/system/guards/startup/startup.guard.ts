import { CanActivateFn } from '@angular/router';
import 'internal-api';

export const startupGuard: CanActivateFn = async (route, state) => {
  const isPackaged = await window.desktop.isPackaged();
  const argv = await window.desktop.argv();
  console.log('startupGuard', isPackaged, argv);
  return true;
};
