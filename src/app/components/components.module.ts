import { PantallaComponent } from './pantalla/pantalla.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Componentes
import { TeclaComponent } from './tecla/tecla.component';

const COMPONENTES_COMPARTIDOS = [
  PantallaComponent,
  TeclaComponent
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule,],
  declarations: [COMPONENTES_COMPARTIDOS],
  exports: [COMPONENTES_COMPARTIDOS]
})
export class ComponentesModule { }
