import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import 'internal-api';
import { ViewNavigator } from '../../../viewer/services/view-navigator/view-navigator';

export const startupGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const viewNavigator = inject(ViewNavigator);

  // const isPackaged = await window.desktop.isPackaged();
  const argv = await window.desktop.argv();

  if (argv._.length === 1 && typeof argv._[0] === 'string') {
    const result = await window.desktop.openFileFromArgs(argv._[0]);

    if (result.success) {
      viewNavigator.setFiles(result.data.files, result.data.selected);
      return router.createUrlTree([ '/view' ]);
    }
  }

  return router.createUrlTree([ 'dashboard' ]);
};
