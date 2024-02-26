import { MiServicioService } from './../../servicios/mi-servicio.service';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart,ChartType, elements } from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent  implements OnInit {

  public chart !: Chart;

  //Creamos las variables que vamos a recibir desde home.html
  @Input() nameTab:string = "";
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];

  //Arrays, donde vamos a meter los datos de las categorías y los resultados de cada una.
  ArrayCategorias: string[] = [];
  ArrayDatosCategorias: number[] = [];

  public apiData: { categoria: string; totalResults: number }[] = [];

  //En el constructor inyectamos nuestro servicio, elementRef y renderer para nuestro chart dinámico
  constructor(private servicio : MiServicioService,private el : ElementRef,private renderer: Renderer2) { }

  ngOnInit() {
    this.inicializarChart();

    //Nos sucribimos a nuestro observable
    this.servicio.datos$.subscribe((datos) => {
      if (datos != undefined) {
       //BUscamos las categorías
        let categorias = this.apiData.find(item => item.categoria === datos.categoria);
        // Si no existe la categoria añadimos el objeto a la apiData
        if (!categorias) {
            this.apiData.push(datos);
        }
        // Con un bucle vamos llenando nuestros arrays con los datos
        this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
          this.ArrayCategorias[index] = row.categoria;
          this.ArrayDatosCategorias[index] = row.totalResults;
         });
        // Actualizamos el chart.
        this.chart.update();
      }
    });
  }
  
private inicializarChart(){
    const data = {
      labels: this.ArrayCategorias,
      datasets: [{
        label: 'My First Dataset',
        data: this.ArrayDatosCategorias,
        backgroundColor: this.backgroundColorCategorias
      }]
    };

    const div = this.renderer.createElement('div');
    // Establecer alguna propiedad del div si es necesario
    this.renderer.setStyle(div, 'width', '100%');
    this.renderer.setStyle(div, 'height', '100%');
    this.renderer.setStyle(div, 'margin', 'auto');
    this.renderer.setStyle(div, 'text-align', 'center');
    this.renderer.setAttribute(div, 'id', 'container'+this.nameTab+'BarChart');

    // Creamos la gráfica
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', this.nameTab+'BarChart');

    // Agregar el canvas al div
    this.renderer.appendChild(div, canvas);
    // Agregar el div al elemento actual del componente
    this.renderer.appendChild(this.el.nativeElement, div);
 
     // Creamos la gráfica
    this.chart = new Chart(canvas, {
      type: 'pie' as ChartType, // tipo de la gráfica 
      data: data, // datos 
      options: { // opciones de la gráfica
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16,
                weight: 'bold'
              }
            },
          }
        },
      }
    });
  }

}
