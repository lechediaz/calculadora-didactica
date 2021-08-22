import { environment } from 'src/environments/environment';

export class DificultadPersonalizadaModel {
  operadores: string[] = ['+'];
  valor_maximo: number = Math.ceil(environment.config.maxPossibleValue / 2);
  valor_minimo: number = 0;
}
