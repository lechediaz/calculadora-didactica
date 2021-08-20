import { DificultadPersonalizadaModel } from './dificultad-personalizada.model';

export class ConfigModel {
    dificultad: number = 1;
    mostrar_boton_generar: boolean = false;
    activar_dificultad_personalizada: boolean = false;
    dificultad_personalizada: DificultadPersonalizadaModel = new DificultadPersonalizadaModel();
}