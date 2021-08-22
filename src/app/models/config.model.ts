import { DificultadPersonalizadaModel } from './dificultad-personalizada.model';

export class ConfigModel {
  activar_dificultad_personalizada: boolean = false;
  dificultad: number = 1;
  dificultad_personalizada: DificultadPersonalizadaModel =
    new DificultadPersonalizadaModel();

  mostrar_boton_generar: boolean = false;
}
