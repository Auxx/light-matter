import { Route } from '@angular/router';
import { startupGuard } from './system/guards/startup/startup.guard';
import { Root } from './system/pages/root/root';
import { ImageView } from './viewer/pages/image-view/image-view';

export const appRoutes: Route[] = [
  { path: '', component: Root, canActivate: [ startupGuard ] },
  { path: 'view', component: ImageView }
];
