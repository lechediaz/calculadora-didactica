import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TeclaModel } from './tecla.model';

@Component({
  selector: 'app-tecla',
  templateUrl: './tecla.component.html',
  styleUrls: ['./tecla.component.scss'],
})
export class TeclaComponent implements OnInit {

  @Input() tecla: TeclaModel;
  @Output() onTeclaPresionada = new EventEmitter<TeclaModel>();

  constructor() { }

  ngOnInit() { }

  onClick = (teclaPresionada: TeclaModel) => {
    // TODO: Hacer que la voz de yuri suene al presionar una tecla

    this.onTeclaPresionada.emit(teclaPresionada);
  }

}
