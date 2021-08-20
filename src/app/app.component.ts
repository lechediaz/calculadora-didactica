import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {
      title: '¿Cuánto es?',
      url: '/cuanto-es',
      icon: 'home'
    },
    {
      title: 'Configuración',
      url: '/configuracion',
      icon: 'hammer'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private configService: ConfigService
  ) {}

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      this.configService.getConfig().then(() => {
        this.splashScreen.hide();
      });
    });
  }
}
