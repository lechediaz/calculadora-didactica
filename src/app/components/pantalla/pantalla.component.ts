import { PantallaModel } from './pantalla.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pantalla',
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.scss'],
})
export class PantallaComponent implements OnInit {

  @Input() operacion: PantallaModel = new PantallaModel();

  constructor() { }

  ngOnInit() { }

}
