import { PantallaModel } from '../../components/pantalla/pantalla.model';
import { Component, OnInit } from '@angular/core';
import { TeclaModel } from '../../components/tecla/tecla.model';
import { ConfigService } from 'src/app/services/config.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { Platform } from '@ionic/angular';
import { ConfigModel } from 'src/app/models/config.model';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cuanto-es',
  templateUrl: './cuanto-es.page.html',
  styleUrls: ['./cuanto-es.page.scss'],
})
export class CuantoEsPage implements OnInit {

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
    private helpersService: HelpersService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {

  }

  ngOnInit() {
    this.crearTeclas();

    this.platform.ready().then(() => {
      this.configService.getConfig().then((config: ConfigModel) => {
        this.config = config;
        this.operacion = this.helpersService.crearOperacion(this.config.dificultad);
      });
    });
  }

  crearTeclas = () => {
    for (let numero = 1; numero < 10; numero++) {
      this.numeros.push(new TeclaModel(String(numero)));
    }

    this.numeros.push(new TeclaModel('-'));
    this.numeros.push(new TeclaModel('0'));
  }

  onTeclaPresionada = (teclaPresionada: TeclaModel) => {
    if (
      (this.operacion.resultado.length === 0 && teclaPresionada.texto === '0')
      || this.operacion.resultado.length > 0 && teclaPresionada.texto === '-') {
      return;
    }

    this.operacion.resultado += teclaPresionada.texto;
  }

  onClickOK = (teclaPresionada: TeclaModel) => {
    this.helpersService.resolverOperacion(this.operacion).then(
      (resultado) => {
        if (this.operacion.resultado.length === 0) {
          this.alertController.create({
            header: 'Escribe el resultado',
            message: 'Por favor escribe el resultado de la operación',
            buttons: [{
              text: 'Ok',
            }]
          }).then((alert) => alert.present());
        }
        else if (this.operacion.resultado === resultado.toString()) {
          this.alertController.create({
            header: '¡Correcto!',
            message: 'Sigue así y pronto dominarás el tema.',
            buttons: [{
              text: 'Siguiente',
              handler: () => {
                this.intentos = 1;
                this.operaciones_hechas++;
                this.operaciones_correctas++;

                // Aumentar nivel de dificultad

                const preguntas_hechas_nivel = this.operaciones_correctas + this.operaciones_incorrectas;
                const porcentaje_Correctas = Math.floor(this.operaciones_correctas / preguntas_hechas_nivel * 100);

                if (this.config.dificultad < 4 && preguntas_hechas_nivel >= 10 && porcentaje_Correctas >= 80) {
                  this.config.dificultad++;
                  this.operaciones_correctas = 0;
                  this.operaciones_incorrectas = 0;

                  this.configService.saveConfig(this.config).then(() => {
                    this.toastController.create({
                      message: `Dificultad aumentada a ${this.config.dificultad}`,
                      duration: 4000,

                    }).then((toast) => {
                      toast.present();
                    });
                  }).catch(() => {
                    this.toastController.create({
                      message: `Error guardando la configuración`,
                      duration: 5000,

                    }).then((toast) => {
                      toast.present();
                    });
                  });
                }

                this.operacion = this.helpersService.crearOperacion(this.config.dificultad);
              }
            }]
          }).then((alert) => alert.present());
        } else {
          let mensaje: string;
          let buttons = [];

          const boton_intentar_de_nuevo = {
            text: 'Reintentar',
            handler: () => {
              this.intentos++;
            }
          };

          const boton_siguiente_operacion = {
            text: 'Siguiente',
            handler: () => {
              this.intentos = 1;
              this.operaciones_hechas++;
              this.operaciones_incorrectas++;
              this.operacion = this.helpersService.crearOperacion(this.config.dificultad);
            }
          };

          switch (this.intentos) {
            case 1:
              mensaje = 'No importa, intentalo de nuevo'
              buttons.push(boton_intentar_de_nuevo);
              break;
            case 2:
              mensaje = 'No te preocupes, ¡ya casi lo logras!'
              buttons.push(boton_intentar_de_nuevo);
              break;
            case 3:
              mensaje = 'Concentrate, ¡tú puedes!'
              buttons.push(boton_intentar_de_nuevo);
              break;
            case 4:
              mensaje = '¿necesitas ayuda?, dile a un adulto que te explique'
              buttons.push(boton_intentar_de_nuevo);
              buttons.push(boton_siguiente_operacion);
              break;
            case 5:
            default:
              mensaje = 'Si quieres puedes intentar con otra operación'
              buttons.push(boton_intentar_de_nuevo);
              buttons.push(boton_siguiente_operacion);
              break;
          }

          this.alertController.create({
            header: 'Incorrecto',
            message: mensaje,
            buttons
          }).then((alert) => alert.present());
        }
      },
      (error) => console.log(error)
    );
  }

  onClickBorrarTodo = (teclaPresionada: TeclaModel) => {
    if (this.operacion.resultado.length === 0) {
      return;
    }

    this.operacion.resultado = '';
  }

  onClickBorrar = (teclaPresionada: TeclaModel) => {
    if (this.operacion.resultado.length === 0) {
      return;
    }

    this.operacion.resultado = this.operacion.resultado.substr(0, this.operacion.resultado.length - 1);
  }

  onClickGenerar = (teclaPresionada: TeclaModel) => {
    this.intentos = 1;
    this.operacion = this.helpersService.crearOperacion(this.config.dificultad);
  }
}
