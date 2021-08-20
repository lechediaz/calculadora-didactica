export class TeclaModel {
    boton: string = 'normal';
    texto: string = '';

    constructor(texto: string, boton: string = 'normal') {
        this.texto = texto;
        this.boton = boton;
    }
}