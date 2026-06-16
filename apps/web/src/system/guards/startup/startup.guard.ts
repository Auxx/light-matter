import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import 'internal-api';
import { firstValueFrom, map } from 'rxjs';
import { GalleryState } from '../../../gallery/services/gallery-state/gallery-state';
import { FileSystem } from '../../../ipc/file-system';
import { ProcessManager } from '../../../ipc/process-manager';
import { ViewNavigator } from '../../../viewer/services/view-navigator/view-navigator';

export const startupGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const viewNavigator = inject(ViewNavigator);
  const fileSystem = inject(FileSystem);
  const galleryState = inject(GalleryState);
  const processManager = inject(ProcessManager);

  const argv = await processManager.argv();
  const isPackaged = await processManager.isPackaged();

  if (isPackaged && argv._.length === 1 && typeof argv._[0] === 'string') {
    const image = argv._[0];
    const dir = await fileSystem.dirname(image);

    await galleryState.navigateTo(dir);

    viewNavigator.standalone.set(true);

    return firstValueFrom(viewNavigator.selectImage(image).pipe(map(() => router.createUrlTree([ '/view' ]))));
  }

  return router.createUrlTree([ '/welcome' ]);
};
