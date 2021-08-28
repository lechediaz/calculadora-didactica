import { Injectable } from '@angular/core';
import { PantallaModel } from '../components/pantalla/pantalla.model';
import { ConfigModel } from '../models/config.model';
import { DificultadPersonalizadaModel } from '../models/dificultad-personalizada.model';

@Injectable({
  providedIn: 'root',
})
export class OperacionService {
  constructor() {}

  /**
   * Genera un número aleatorio segùn el rango indicado.
   * @param minimo Número mínimo a generar
   * @param maximo Número máximo a generar
   */
  private generarNumeroAleatorio(minimo: number = 0, maximo: number = 10) {
    return Math.floor(Math.random() * (maximo - minimo + 1) + minimo);
  }

  /**
   * Genera un número aleatorio segùn la dificultad configurada por el usuario.
   * @param dificultad Dificultad configurada por el usuario.
   */
  private generarNumeroAleatorioSegunDificultad(dificultad: number) {
    switch (dificultad) {
      case 1:
        return this.generarNumeroAleatorio(0, 10);
      case 2:
        return this.generarNumeroAleatorio(0, 50);
      case 3:
        return this.generarNumeroAleatorio(0, 100);
      case 4:
        return this.generarNumeroAleatorio(0, 150);

      default:
        return 0;
    }
  }

  /**
   * Se escoge un operador aleatoriamente según la dificultad configurada por el usuario.
   * @param dificultad Dificultad configurada por el usuario.
   */
  private generarOperadorSegunDificultad(dificultad: number) {
    if (dificultad > 1) {
      switch (this.generarNumeroAleatorio(0, dificultad - 1)) {
        case 1:
          return '-';
        case 2:
          return '*';
        case 3:
          return '/';
      }
    }

    return '+';
  }

  /**
   * Obtiene uno de los 10 primeros multiplos de un nùmero aleatoriamente.
   * @param numero Número a obtener el multiplo.
   */
  private escogerMultiploAleatorio(numero: number) {
    if (numero === 0 || numero === 1) {
      return numero;
    } else {
      numero++;

      let multiplos: number[] = [];

      for (let i = 1; i < 10; i++) {
        multiplos.push(1 * numero);
      }

      return multiplos[this.generarNumeroAleatorio(0, 9)];
    }
  }

  /**
   * Crea una operaciòn de acuerdo a la configuración hecha por el usuario.
   * @param config Configurada hecha por el usuario.
   */
  crearOperacion(config: ConfigModel): PantallaModel {
    let operacion: PantallaModel;

    if (config.activar_dificultad_personalizada) {
      operacion = this.crearOperacionSegunConfigPersonalizada(
        config.dificultad_personalizada
      );
    } else {
      operacion = this.crearOperacionSegunDificultad(config.dificultad);
    }

    return operacion;
  }

  /**
   * Crea una operaciòn de acuerdo a la dificultad personalizada configurada por el usuario.
   * @param config Dificultad personalizada configurada por el usuario.
   */
  private crearOperacionSegunConfigPersonalizada(
    config: DificultadPersonalizadaModel
  ): PantallaModel {
    const { operadores, valor_maximo, valor_minimo } = config;
    const operacion = new PantallaModel();

    const idxOperadorAleatorio = this.generarNumeroAleatorio(
      0,
      operadores.length - 1
    );

    operacion.operador = operadores[idxOperadorAleatorio];
    operacion.primer_termino = this.generarNumeroAleatorio(
      valor_minimo,
      valor_maximo
    ).toString();

    let segundo_termino = this.generarNumeroAleatorio(
      valor_minimo,
      valor_maximo
    );

    operacion.segundo_termino = segundo_termino.toString();

    if (operacion.operador === '/') {
      operacion.primer_termino =
        this.escogerMultiploAleatorio(segundo_termino).toString();
    }

    return operacion;
  }

  /**
   * Crea una operaciòn de acuerdo a la dificultad por defecto configurada por el usuario.
   * @param dificultad Dificultad por defecto configurada por el usuario.
   */
  private crearOperacionSegunDificultad(dificultad: number) {
    const operacion = new PantallaModel();

    operacion.operador = this.generarOperadorSegunDificultad(dificultad);
    operacion.primer_termino =
      this.generarNumeroAleatorioSegunDificultad(dificultad).toString();

    let segundo_termino =
      this.generarNumeroAleatorioSegunDificultad(dificultad);
    operacion.segundo_termino = segundo_termino.toString();

    if (operacion.operador === '/') {
      operacion.primer_termino =
        this.escogerMultiploAleatorio(segundo_termino).toString();
    }

    return operacion;
  }

  /**
   * Resulve una operaciòn dada
   * @param operacion Operaciòn a resolver
   */
  resolverOperacion(operacion: PantallaModel): number {
    if (operacion.primer_termino.length === 0) {
      throw new Error('El primer término está vacío');
    } else if (operacion.segundo_termino.length === 0) {
      throw new Error('El segundo término está vacío');
    } else {
      const primer_termino = Number(operacion.primer_termino);
      const segundo_termino = Number(operacion.segundo_termino);

      switch (operacion.operador) {
        case '+':
          return primer_termino + segundo_termino;
        case '-':
          return primer_termino - segundo_termino;
        case '*':
          return primer_termino * segundo_termino;
        case '/':
          return primer_termino / segundo_termino;
      }
    }
  }
}
