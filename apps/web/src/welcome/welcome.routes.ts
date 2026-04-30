import { Route } from '@angular/router';
import { flags } from 'internal-api';
import { Dashboard } from './pages/dashboard/dashboard';
import { GalleryPage } from './pages/gallery/gallery.page';

export const routes: Route[] = [
  { path: '', component: flags().enableGalleryMode ? GalleryPage : Dashboard },
  { path: 'dashboard', component: Dashboard },
  { path: 'gallery', component: GalleryPage }
];
