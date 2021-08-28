import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PantallaModel } from '../../components/pantalla/pantalla.model';
import { TeclaModel } from '../../components/tecla/tecla.model';
import { ConfigNotSavedError } from 'src/app/models/config-not-saved.error';
import { ConfigModel } from 'src/app/models/config.model';
import { ConfigService } from 'src/app/services/config.service';
import { OperacionService } from 'src/app/services/operacion.service';

@Component({
  selector: 'app-cuanto-es',
  templateUrl: './cuanto-es.page.html',
  styleUrls: ['./cuanto-es.page.scss'],
})
export class CuantoEsPage implements OnInit, OnDestroy {
  private _suscripciones: Subscription = new Subscription();

  config: ConfigModel = new ConfigModel();

  // Teclas
  numeros: TeclaModel[] = [];
  tecla_borrar_todo: TeclaModel = new TeclaModel('Borrar todo', 'horizontal');
  tecla_borrar: TeclaModel = new TeclaModel('Borrar', 'horizontal');
  tecla_generar: TeclaModel = new TeclaModel('Generar', 'horizontal');
  tecla_ok: TeclaModel = new TeclaModel('Ok', 'horizontal');

  operacion: PantallaModel = new PantallaModel();
  intentos: number = 1;
  operaciones_hechas: number = 0;
  operaciones_correctas: number = 0;
  operaciones_incorrectas: number = 0;

  constructor(
    private platform: Platform,
    private configService: ConfigService,
    private operacionService: OperacionService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.crearTeclas();

    this.platform.ready().then(() => {
      // Suscripciòn a cambios en la configuración.
      this._suscripciones.add(
        this.configService.$config.subscribe((config) => {
          this.config = config;
          this.operacion = this.operacionService.crearOperacion(config);
        })
      );
    });
  }

  ngOnDestroy() {
    this._suscripciones.unsubscribe();
  }

  crearTeclas = () => {
    for (let numero = 1; numero < 10; numero++) {
      this.numeros.push(new TeclaModel(String(numero)));
    }

    this.numeros.push(new TeclaModel('-'));
    this.numeros.push(new TeclaModel('0'));
  };

  /**
   * Informa al usuario que la respuesta es correcta y realiza cambios en configuración si es necesario.
   */
  tratarRespuestaCorrecta = async () => {
    const alert = await this.alertController.create({
      header: '¡Correcto!',
      message: 'Sigue así y pronto dominarás el tema.',
      buttons: [
        {
          text: 'Siguiente',
          handler: this.guardarRespuestaCorrecta,
        },
      ],
    });

    await alert.present();
  };

  /**
   * Informa al usuario que la respuesta es incorrecta.
   */
  tratarRespuestaIncorrecta = async () => {
    let mensaje: string;
    let buttons = [];

    const boton_intentar_de_nuevo = {
      text: 'Reintentar',
      handler: () => {
        this.intentos++;
      },
    };

    const boton_siguiente_operacion = {
      text: 'Siguiente',
      handler: () => {
        this.intentos = 1;
        this.operaciones_hechas++;
        this.operaciones_incorrectas++;
        this.operacion = this.operacionService.crearOperacion(this.config);
      },
    };

    switch (this.intentos) {
      case 1:
        mensaje = 'No importa, intentalo de nuevo';
        buttons.push(boton_intentar_de_nuevo);
        break;
      case 2:
        mensaje = 'No te preocupes, ¡ya casi lo logras!';
        buttons.push(boton_intentar_de_nuevo);
        break;
      case 3:
        mensaje = 'Concentrate, ¡tú puedes!';
        buttons.push(boton_intentar_de_nuevo);
        break;
      case 4:
        mensaje = '¿Necesitas ayuda?, dile a un adulto que te explique';
        buttons.push(boton_intentar_de_nuevo);
        buttons.push(boton_siguiente_operacion);
        break;
      case 5:
      default:
        mensaje = 'Si quieres puedes intentar con otra operación';
        buttons.push(boton_intentar_de_nuevo);
        buttons.push(boton_siguiente_operacion);
        break;
    }

    const alert = await this.alertController.create({
      header: 'Incorrecto',
      message: mensaje,
      buttons,
    });

    await alert.present();
  };

  /**
   * Permite guardar la respuesta correcta.
   */
  guardarRespuestaCorrecta = async () => {
    this.intentos = 1;
    this.operaciones_hechas++;
    this.operaciones_correctas++;

    // Aumentar nivel de dificultad

    if (!this.config.activar_dificultad_personalizada) {
      const preguntas_hechas_nivel =
        this.operaciones_correctas + this.operaciones_incorrectas;
      const porcentaje_Correctas = Math.floor(
        (this.operaciones_correctas / preguntas_hechas_nivel) * 100
      );

      if (
        this.config.dificultad < 4 &&
        preguntas_hechas_nivel >= 10 &&
        porcentaje_Correctas >= 60
      ) {
        try {
          this.operaciones_correctas = 0;
          this.operaciones_incorrectas = 0;

          const newConfig = { ...this.config };

          newConfig.dificultad++;

          await this.configService.saveConfig(newConfig);

          const toast = await this.toastController.create({
            message: `Dificultad aumentada a ${newConfig.dificultad}`,
            duration: 4000,
          });

          await toast.present();
        } catch (error) {
          let message = `Ha ocurrido un error mientras se aumentaba la dificultad.`;

          if (error instanceof ConfigNotSavedError) {
            message = error.message;
          }

          const toast = await this.toastController.create({
            message,
            duration: 5000,
          });

          await toast.present();
        }
      } else {
        this.operacion = this.operacionService.crearOperacion(this.config);
      }
    } else {
      this.operacion = this.operacionService.crearOperacion(this.config);
    }
  };

  /**
   * Evento que se dispara cuando se presiona una tecla numérica de la calculadora.
   * @param teclaPresionada tecla numérica presionada de la calculadora.
   */
  onTeclaPresionada = (teclaPresionada: TeclaModel) => {
    const { texto } = teclaPresionada;
    let { resultado } = this.operacion;

    if (
      (texto === '0' && resultado.startsWith('0')) ||
      (resultado.length > 0 && texto === '-')
    ) {
      return;
    }

    if (resultado.startsWith('0')) {
      resultado = '';
    }

    this.operacion.resultado = `${resultado}${texto}`;
  };

  /**
   * Evento que se dispara cuando se presiona la tecla 'OK'.
   * @param teclaPresionada Tecla 'OK'.
   */
  onClickOK = async (teclaPresionada: TeclaModel) => {
    try {
      if (this.operacion.resultado.length === 0) {
        const alert = await this.alertController.create({
          header: 'Escribe el resultado',
          message: 'Por favor escribe el resultado de la operación',
          buttons: [{ text: 'Ok' }],
        });

        await alert.present();
      } else {
        const resultado = this.operacionService.resolverOperacion(
          this.operacion
        );

        if (this.operacion.resultado === resultado.toString()) {
          await this.tratarRespuestaCorrecta();
        } else {
          await this.tratarRespuestaIncorrecta();
        }
      }
    } catch (error) {
      const toast = await this.toastController.create({
        message:
          'Oops, ha ocurrido un problema inesperado, por faovr intenta de nuevo.',
        duration: 4000,
      });

      await toast.present();
    }
  };

  /**
   * Evento que se dispara cuando se presiona la tecla 'Borrar todo'
   * @param teclaPresionada Tecla 'Borrar todo'.
   */
  onClickBorrarTodo = (teclaPresionada: TeclaModel) => {
    if (this.operacion.resultado.length === 0) {
      return;
    }

    this.operacion.resultado = '';
  };

  /**
   * Evento que se dispara cuando se presiona la tecla 'Borrar.
   * @param teclaPresionada Techa 'Borrar'.
   */
  onClickBorrar = (teclaPresionada: TeclaModel) => {
    if (this.operacion.resultado.length === 0) {
      return;
    }

    this.operacion.resultado = this.operacion.resultado.substr(
      0,
      this.operacion.resultado.length - 1
    );
  };

  /**
   * Evento que se dispara cuando se presiona la tecla 'Generar.
   * @param teclaPresionada Techa 'Generar'.
   */
  onClickGenerar = (teclaPresionada: TeclaModel) => {
    this.intentos = 1;
    this.operacion = this.operacionService.crearOperacion(this.config);
  };
}
