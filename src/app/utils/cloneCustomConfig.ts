import { DificultadPersonalizadaModel } from 'src/app/models/dificultad-personalizada.model';

/**
 * Permite clonar la información un objeto de tipo DificultadPersonalizadaModel en una nueva instancia.
 * @param original Instancia que contiene la información original.
 * @returns Nueva instancia con la información original.
 */
export const cloneCustomConfig = (
  original: DificultadPersonalizadaModel
): DificultadPersonalizadaModel => {
  const nuevo = new DificultadPersonalizadaModel();

  nuevo.operadores = original.operadores.slice(0);
  nuevo.valor_maximo = original.valor_maximo;
  nuevo.valor_minimo = original.valor_minimo;

  return nuevo;
};

export default cloneCustomConfig;
