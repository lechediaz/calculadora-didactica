import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class SalirConfigGuard implements CanDeactivate<unknown> {
  constructor(
    private alertController: AlertController,
    private configService: ConfigService
  ) {}

  async canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Promise<boolean> {
    if (this.configService.needSaveConfig) {
      try {
        await this.configService.saveModifiedConfig();
      } catch (error) {
        const message =
          'Ha ocurrido un error guardando la configuración, por favor intente de nuevo.';

        console.warn(`${message} Error: ${error}`);

        const alerta = await this.alertController.create({
          message,
        });

        await alerta.present();

        return false;
      }
    }

    return true;
  }
}
