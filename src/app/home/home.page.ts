import { Component } from '@angular/core';
import { MiServicioService } from '../servicios/mi-servicio.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tipoChart : string[] = ['bar-chart','line-chart','pie-chart'];
  tipoDeChartSeleccionado: string = "bar-chart";

  // Array para la cabecera de las noticias
  categorias: string[] = [
    "business",
    "entertainment",
    "general",
    "technology",
    "health",
    "science",
    "sports"
  ];

  backgroundColorCat: string[] = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)'
  ];

  borderColorCat: string[] =[
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
  ];

  constructor(public servicio: MiServicioService) {}

  ngOnInit() {
    this.categorias.forEach(categoria => {
      this.servicio.cargarCategoria(categoria);
    });
  }

  //Gestionamos el cambio de segmento
  cambiarChart(event: any) {
    
    this.tipoDeChartSeleccionado = event.detail.value;
    
    if (this.tipoDeChartSeleccionado == "bar-chart"){
      this.categorias.forEach(categoria => {
        this.servicio.cargarCategoria(categoria);
      });
    }
  }
}
