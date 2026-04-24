import { Route } from '@angular/router';
import { startupGuard } from '../system/guards/startup/startup.guard';
import { Root } from '../system/pages/root/root';

export const appRoutes: Route[] = [
  { path: '', component: Root, canActivate: [ startupGuard ] },
  { path: 'view', loadChildren: () => import('../viewer/viewer.routes').then(m => m.routes) },
  { path: 'welcome', loadChildren: () => import('../welcome/welcome.routes').then(m => m.routes) }
];
