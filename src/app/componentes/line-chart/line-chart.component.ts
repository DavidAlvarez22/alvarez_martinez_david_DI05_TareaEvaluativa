import { MiServicioService } from './../../servicios/mi-servicio.service';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent  implements OnInit {

  public chart!: Chart;

  // Variable que podríamos recibir desde el html( En este caso no la enviamos)
  @Input() nameTab: string = "";

  //Arrays, donde vamos a meter los datos de las categorías y los resultados de cada una.
  categorias: string[] = [];
  datosCategorias: number[] = [];

  //Variable apiData
  public apiData: {categoria: string;totalResults: number} [] = [];

  //En el constructor inyectamos nuestro servicio, elementRef y renderer para nuestro chart dinámico
  constructor(private servicio: MiServicioService,private el : ElementRef, private renderer : Renderer2) { }

  ngOnInit() {
    console.log("Ejecuta line-chart")
    this.inicializarChart();
    // Nos suscribimos al observable de tipo BehaviorSubject y cuando este emita un valor, recibiremos una notificación con el nuevo valor.
    this.servicio.datos$.subscribe((datos) => {
      if (datos != undefined) {
        // Creamos una variable donde vemos si existe la categoria
        let buscarCategoria = this.apiData.find(unDato => unDato.categoria === datos.categoria);
        // Si no existe la categoria la añadimos a la apiData
        if (!buscarCategoria) {
            this.apiData.push(datos);
        }
        // cargamos categorías y datos
        this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
          this.categorias[index] = row.categoria;
          this.datosCategorias[index] = row.totalResults;
         });
        // Actualizamos el chart
        this.chart.update();
      }
    });

  }
  private inicializarChart(){
    // datos
    const data = {
      labels: this.categorias,
      datasets: [{
        label: 'My Parameters Dataset',
        data: this.datosCategorias,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    const div = this.renderer.createElement('div');
    // Establecer alguna propiedad del div si es necesario
    this.renderer.setStyle(div, 'width', '100%');
    this.renderer.setStyle(div, 'height', '100%');
    this.renderer.setStyle(div, 'margin', 'auto');
    this.renderer.setStyle(div, 'text-align', 'center');
    this.renderer.setAttribute(div, 'id', 'container'+this.nameTab+'lineChart');

    // Creamos la gráfica
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', this.nameTab+'lineChart');

    // Agregar el canvas al div
    this.renderer.appendChild(div, canvas);
    // Agregar el div al elemento actual del componente
    this.renderer.appendChild(this.el.nativeElement, div);

    // Creamos la gráfica
    this.chart = new Chart(canvas, {
      type: 'line' as ChartType, // tipo de la gráfica 
      data: data, // datos 
      options: { // opciones de la gráfica
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 0,
              font: {
                size: 16,
                weight: 'bold'
              }
            },
          }
        },
      }
    });
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

}
