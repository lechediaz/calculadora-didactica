import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigModel } from '../models/config.model';
import { ConfigNotFoundError } from '../models/config-not-found.error';
import cloneConfig from '../utils/cloneConfig';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private _config: BehaviorSubject<ConfigModel> =
    new BehaviorSubject<ConfigModel>(null);

  private _configSaved: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  $config: Observable<ConfigModel> = this._config.asObservable();
  $configSaved: Observable<boolean> = this._configSaved.asObservable();

  constructor(
    private platform: Platform,
    private nativeStorage: NativeStorage
  ) {}

  public set configSaved(isSaved: boolean) {
    this._configSaved.next(isSaved);
  }

  public set config(config: ConfigModel) {
    this._config.next(cloneConfig(config));
  }

  /**
   * Recupera la configuración dependiento de donde se esté ejecutando la aplicación, si desde un navegador o un dispositivo.
   * @returns Configuración recuperada
   */
  loadConfig = async () => {
    let config: ConfigModel;

    if (this.platform.is('cordova')) {
      config = await this.getConfigFromDevice();
    } else {
      config = await this.getConfigFromBrowser();
    }

    this.config = config;
  };

  /**
   * Recupera la configuración almacenada en el dispositivo.
   * @returns Configuración recuperada desde el dispositivo.
   */
  private getConfigFromDevice = async (): Promise<ConfigModel> => {
    try {
      return await this.nativeStorage.getItem('config');
    } catch (error) {
      if (error.code === 2) {
        // ITEM_NOT_FOUND

        throw new ConfigNotFoundError(
          'No existe la configuración en el dispositivo.'
        );
      }

      throw error;
    }
  };

  /**
   * Recupera la configuración almacenada en el navegador.
   * @returns Configuración recuperada desde el navegador.
   */
  private getConfigFromBrowser = async (): Promise<ConfigModel> => {
    let config: any = localStorage.getItem(environment.config.key);

    if (config === null) {
      throw new ConfigNotFoundError(
        'No existe la configuración en el navegador.'
      );
    }

    return JSON.parse(config);
  };

  /**
   * Permite guardar la configuración realizada por el usuario.
   * @param config Configuración a guardar.
   */
  saveConfig = async (config: ConfigModel) => {
    if (this.platform.is('cordova')) {
      await this.saveConfigOnDevice(config);
    } else {
      await this.saveConfigonBrowser(config);
    }

    this.config = config;
    this.configSaved = true;
  };

  /**
   * Permite guardar la configuración en el dispositivo.
   * @param config Configuración a guardar.
   */
  private saveConfigOnDevice = async (config: ConfigModel) => {
    try {
      await this.nativeStorage.setItem('config', config);
    } catch (error) {
      throw new Error(
        'Ocurrió un error guardando la configuración en el dispositivo.'
      );
    }
  };

  /**
   * Permite guardar la configuración en el navegador.
   * @param config Configuración a guardar.
   */
  private saveConfigonBrowser = async (config: ConfigModel) => {
    try {
      localStorage.setItem('config', JSON.stringify(config));
    } catch (error) {
      throw new Error(
        'Ocurrió un error guardando la configuración en el navegador.'
      );
    }
  };
}
