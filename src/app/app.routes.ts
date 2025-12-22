import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '',
  loadChildren: () =>
    import('./pages/pages-routing.module').then((p) => p.PagesRoutingModule),
}];
