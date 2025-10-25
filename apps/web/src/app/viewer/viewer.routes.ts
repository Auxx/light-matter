import { Route } from '@angular/router';
import { ImageView } from './pages/image-view/image-view';

export const routes: Route[] = [
  { path: ':imageUrl', component: ImageView }
];
