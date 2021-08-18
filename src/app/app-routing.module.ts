import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./components/auth/auth-module.module')
      .then(m => m.AuthModuleModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module')
      .then(m => m.DashboardModule),
  },
  {
    path: 'notFound',
    loadChildren: () => import('./components/page-not-found/page-not-found.module')
      .then(m => m.PageNotFoundModule),
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/notFound' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
