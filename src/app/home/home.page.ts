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

  // Array de categorias
  categorias: string[] = [
    "business",
    "entertainment",
    "general",
    "technology",
    "health",
    "science",
    "sports"
  ];

  //Array de colores
  backgroundColorCat: string[] = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)'
  ];
  //Array colores de bordes
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
    //Por cada categoría vamos llamando a nuestro servicio
    this.categorias.forEach(categoria => {
      this.servicio.cargarCategoria(categoria);
    });
  }

  //Gestionamos el cambio de segmento
  cambiarChart(event: any) {
    
    this.tipoDeChartSeleccionado = event.detail.value;
    
    //En función de la pestaña seleccionada enviamos llamada al servicio
    if (this.tipoDeChartSeleccionado == "bar-chart" || this.tipoDeChartSeleccionado == "pie-chart" || this.tipoDeChartSeleccionado == "line-chart"){
      this.categorias.forEach(categoria => {
        this.servicio.cargarCategoria(categoria);
      });
    }
  }
}
