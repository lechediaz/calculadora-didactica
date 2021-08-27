import { Injectable } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigModel } from '../models/config.model';
import { ConfigNotFoundError } from '../models/config-not-found.error';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  /** Configuración actual de la aplicación. */
  private _config: BehaviorSubject<ConfigModel> =
    new BehaviorSubject<ConfigModel>(null);

  /** Configuración que está siendo modificada. */
  private _configModificated: BehaviorSubject<ConfigModel> =
    new BehaviorSubject<ConfigModel>(null);

  /** Permite indicar que se necesita guardar la configuración. */
  private _needSaveConfig: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  $config: Observable<ConfigModel> = this._config.asObservable();

  $configModificated: Observable<ConfigModel> =
    this._configModificated.asObservable();

  $needSaveConfig: Observable<boolean> = this._needSaveConfig.asObservable();

  constructor(
    private platform: Platform,
    private nativeStorage: NativeStorage,
    private loadingController: LoadingController
  ) {}

  /**
   * Permite informar el cambio sobre la configuración en la aplicación.
   * @param config Configuración a guardar.
   */
  public set config(config: ConfigModel) {
    this._config.next({ ...config });
  }

  /**
   * Permite informar el cambio sobre la configuración modificada.
   * @param config Configuración modificada.
   */
  public set configModificated(config: ConfigModel) {
    this._configModificated.next({ ...config });
  }

  /**
   * Permite informar que se necesita guardar la configuración.
   * @param needSaveConfig True si se necesita guardar la configuración, false de lo contrario.
   */
  public set needSaveConfig(needSaveConfig: boolean) {
    this._needSaveConfig.next(needSaveConfig);
  }

  /** Permite saber si se necesita guardar la configuración. */
  public get needSaveConfig(): boolean {
    return this._needSaveConfig.getValue();
  }

  /**
   * Recupera la configuración dependiento de donde se esté ejecutando la aplicación, si desde un navegador o un dispositivo.
   * @returns Configuración recuperada
   */
  loadConfig = async () => {
    console.info('Empieza carga de configuración.');

    let config: ConfigModel;

    if (this.platform.is('cordova')) {
      config = await this.getConfigFromDevice();
    } else {
      config = await this.getConfigFromBrowser();
    }

    this.config = config;
    this.configModificated = config;
    this.needSaveConfig = false;

    console.info('Finaliza carga de configuración.');
  };

  /**
   * Recupera la configuración almacenada en el dispositivo.
   * @returns Configuración recuperada desde el dispositivo.
   */
  private getConfigFromDevice = async (): Promise<ConfigModel> => {
    try {
      console.info('Obtener configuración desde el dispositivo móvil.');

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
    console.info('Obtener configuración desde el navegador.');

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
   * @param showLoading True para mostrar loading, de lo contrario false.
   */
  saveConfig = async (config: ConfigModel, showLoading: boolean = false) => {
    console.info('Empieza guardado de configuración.');

    let loading: HTMLIonLoadingElement;

    if (showLoading) {
      loading = await this.loadingController.create({
        message: 'Guardando configuración, por favor espere',
        spinner: 'bubbles',
      });

      await loading.present();
    }

    if (this.platform.is('cordova')) {
      await this.saveConfigOnDevice(config);
    } else {
      await this.saveConfigonBrowser(config);
    }

    this.config = config;
    this.configModificated = config;
    this.needSaveConfig = false;

    if (showLoading) {
      await loading.dismiss();
    }

    console.info('Finaliza guardado de configuración.');
  };

  /**
   * Permite guardar la configuración modificada por el usuario.
   */
  saveModifiedConfig = async () => {
    await this.saveConfig(this._configModificated.getValue(), true);
  };

  /**
   * Permite guardar la configuración en el dispositivo.
   * @param config Configuración a guardar.
   */
  private saveConfigOnDevice = async (config: ConfigModel) => {
    try {
      console.info('Guardar configuración en el dispositivo móvil.');

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
      console.info('Guardar configuración en el navegador.');

      localStorage.setItem('config', JSON.stringify(config));
    } catch (error) {
      throw new Error(
        'Ocurrió un error guardando la configuración en el navegador.'
      );
    }
  };
}
