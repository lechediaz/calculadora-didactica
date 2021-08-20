import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ConfigModel } from '../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config: ConfigModel = null;

  constructor(
    private platform: Platform,
    private nativeStorage: NativeStorage
  ) { }

  /** Obtiene configuración del usuario */
  getConfig = () => new Promise<ConfigModel>((resolve, reject) => {
    this.platform.ready().then(() => {
      if (this.config !== null) {
        resolve({ ...this.config });
      } else {
        if (this.platform.is('cordova')) {
          this.nativeStorage.getItem('config').then(
            (config: any) => {
              this.config = config;
              resolve({ ...config });
            },
            (error) => {
              if (error.code === 2) {
                // ITEM_NOT_FOUND

                this.saveConfig(new ConfigModel()).then(
                  () => resolve({ ...this.config }),
                  () => reject()
                );
              } else {
                console.error('Error buscando el config en el dispositivo', error);
                reject();
              }
            }
          );
        } else {
          let config: any = localStorage.getItem('config');

          if (config === null) {
            config = new ConfigModel();

            this.saveConfig(config).then(
              () => resolve({ ...config }),
              () => reject()
            );
          } else {
            config = JSON.parse(config);
            this.config = config;
            resolve({ ...config });
          }
        }
      }
    });
  })

  /** Guarda la configuración del usuario */
  saveConfig = (config: ConfigModel) => new Promise<void>((resolve, reject) => {
    if (this.platform.is('cordova')) {
      this.nativeStorage.setItem('config', config).then(
        () => {
          this.config = { ...config };
          resolve();
        },
        error => {
          console.error('Error guardando config en el dispositivo', error);
          reject();
        }
      );
    } else {
      localStorage.setItem('config', JSON.stringify(config));
      this.config = { ...config };
      resolve();
    }
  });
}
