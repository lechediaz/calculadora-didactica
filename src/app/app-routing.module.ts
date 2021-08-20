import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'cuanto-es',
    pathMatch: 'full',
  },
  {
    path: 'configuracion',
    loadChildren: () =>
      import('./pages/configuracion/configuracion.module').then(
        (m) => m.ConfiguracionPageModule
      ),
  },
  {
    path: 'cuanto-es',
    loadChildren: () =>
      import('./pages/cuanto-es/cuanto-es.module').then(
        (m) => m.CuantoEsPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
