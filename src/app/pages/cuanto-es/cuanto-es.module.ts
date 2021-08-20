import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CuantoEsPage } from './cuanto-es.page';

import { ComponentesModule } from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: CuantoEsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentesModule
  ],
  declarations: [CuantoEsPage]
})
export class CuantoEsPageModule {}
