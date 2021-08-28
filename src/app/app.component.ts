import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConfigService } from './services/config.service';
import { ConfigNotFoundError } from './models/config-not-found.error';
import { ConfigModel } from './models/config.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: '¿Cuánto es?',
      url: '/cuanto-es',
      icon: 'calculator',
    },
    {
      title: 'Configuración',
      url: '/configuracion',
      icon: 'hammer',
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.initializeApp().then(() => {});
  }

  initializeApp = async () => {
    try {
      await this.platform.ready();

      const enDispositivo = this.platform.is('cordova');

      if (enDispositivo) {
        this.statusBar.styleDefault();
      }

      await this.configService.loadConfig();

      if (enDispositivo) {
        this.splashScreen.hide();
      }
    } catch (error) {
      // TODO: Determinar si vrear config por defecto
      if (error instanceof ConfigNotFoundError) {
        // TODO: mostrar error en caso que ocurra.
        await this.configService.saveConfig(new ConfigModel());
      } else {
        console.warn(error);
        // TODO: mostrar error y preguntar si desea cargar la configuración por defecto.
      }
    }
  };
}
