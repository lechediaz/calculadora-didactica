import cloneCustomConfig from './cloneCustomConfig';
import { ConfigModel } from 'src/app/models/config.model';

/**
 * Permite clonar la información un objeto de tipo ConfigModel en una nueva instancia.
 * @param original Instancia que contiene la información original.
 * @returns Nueva instancia con la información original.
 */
export const cloneConfig = (original: ConfigModel): ConfigModel => {
  const nuevo = new ConfigModel();

  nuevo.activar_dificultad_personalizada =
    original.activar_dificultad_personalizada;

  nuevo.dificultad = original.dificultad;

  nuevo.dificultad_personalizada = cloneCustomConfig(
    original.dificultad_personalizada
  );

  nuevo.mostrar_boton_generar = original.mostrar_boton_generar;

  return nuevo;
};

export default cloneConfig;
