import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { RangeValue } from '@ionic/core';
import { Subscription } from 'rxjs';
import { ConfigModel } from 'src/app/models/config.model';
import { ConfigService } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionPage implements OnInit, OnDestroy {
  public readonly environment = environment;

  private _suscripciones: Subscription = new Subscription();

  config = new ConfigModel();
  guardando_configuracion = false;
  mostrar_boton_guardar = false;

  constructor(
    private platform: Platform,
    private cd: ChangeDetectorRef,
    private configService: ConfigService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      // Suscripciòn a cambios en la configuración.
      this._suscripciones.add(
        this.configService.$config.subscribe((config) => {
          this.config = config;
          this.cd.detectChanges();
        })
      );
    });
  }

  ngOnDestroy() {
    this._suscripciones.unsubscribe();
  }

  onChangeDificultad = (dificultad: number | RangeValue) => {
    if (typeof dificultad === 'number') {
      this.config.dificultad = dificultad;
      this.guardarConfiguracion();
    }
  };

  onToggleActivarDificultadPersonalizada = (activar: boolean) => {
    this.config.activar_dificultad_personalizada = activar;
    this.guardarConfiguracion();
  };

  onChangeTerminosPosibles = (valores: any) => {
    this.config.dificultad_personalizada.valor_minimo = valores.lower;
    this.config.dificultad_personalizada.valor_maximo = valores.upper;
    this.guardarConfiguracion();
  };

  onChangeOperador = (operador: string, seleccionado: boolean) => {
    if (seleccionado) {
      this.config.dificultad_personalizada.operadores.push(operador);
    } else {
      this.config.dificultad_personalizada.operadores =
        this.config.dificultad_personalizada.operadores.filter(
          (o) => o !== operador
        );

      if (this.config.dificultad_personalizada.operadores.length === 0) {
        this.config.dificultad_personalizada.operadores = ['+'];

        this.toastController
          .create({
            message: `Se debe configurar al menos un operador, se agrega la suma por defecto`,
            duration: 5000,
          })
          .then((toast) => toast.present());
      }
    }

    this.guardarConfiguracion();
  };

  onClickGuardarButton = () => {
    this.guardarConfiguracion();
  };

  private guardarConfiguracion = () => {
    if (!this.guardando_configuracion) {
      this.guardando_configuracion = true;

      this.configService
        .saveConfig(this.config)
        .then(() => {
          this.mostrar_boton_guardar = false;
        })
        .catch(() => {
          this.mostrar_boton_guardar = true;

          this.toastController
            .create({
              message: `Error guardando la configuración, intenta de nuevo`,
              duration: 5000,
            })
            .then((toast) => {
              toast.present();
            });
        })
        .finally(() => {
          this.guardando_configuracion = false;
          this.cd.detectChanges();
        });
    }
  };
}
