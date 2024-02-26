import { MiServicioService } from './../../servicios/mi-servicio.service';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent  implements OnInit {

  //Creamos las variables que vamos a recibir desde home.html
  @Input() nombresCategorias: string[] = [];
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];

  //creamos variables chart y apiData
  public chart!: Chart;
  public apiData: { categoria: string; totalResults: number }[] = [];
 
  //En el constructor inyectamos nuestro servicio, elementRef y renderer para nuestro chart dinámico
  constructor(private servicio: MiServicioService,private elementRef : ElementRef, private renderer :Renderer2) { }

  ngOnInit() {
    this.inicializarChart();

    //Nos sucribimos a nuestro observable
    this.servicio.datos$.subscribe((datos) => {
      if (datos != undefined) {
        this.actualizarValoresChart(datos.categoria, datos.totalResults);
        this.actualizarChart();
      }
    });
  }

  private inicializarChart() {
    //Objeto datasets que pasaremos a nuestro chart
    const datasetsByCompany: { [key: string]:
      {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
      } 
    } = {};
  
    //Estructura condicional. Si no existe el cahrt va recorriendo apiData.
    if (!this.chart) {
      this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
        const { categoria, totalResults } = row;
        //Si no tenemos la categoría que le pasamos, crea un dataset vacío
        if (!datasetsByCompany[categoria]) {
          datasetsByCompany[categoria] = {
            label: categoria,
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
          };
        }
      });
      
      //Hacemos casting para que datasetsByCompany sea lo esperado por datasets
      const datasets = Object.values(datasetsByCompany);

      //creamos nuestro canvas
      const canvas = this.renderer.createElement('canvas');
      this.renderer.setAttribute(canvas, 'id', 'bar-chart');
      const container = this.elementRef.nativeElement.querySelector('#contenedor-barchart');
      this.renderer.appendChild(container, canvas);
      
      //creamos el chart y le pasamos los datasets
      this.chart = new Chart(canvas, {
        type: 'bar' as ChartType,
        data: {
          labels: [],
          datasets: datasets
        },
        options: {
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
                font: {
                  size: 16,
                  weight: 'bold',
                },
              },
            }
          },
        }
      });
    } 
    
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

  //Método actualizar chart que actualiza el chart. No comentamos cada parte , ya que es réplica de lo recogido en el método anterior.
  private actualizarChart() {
    
    const datasetsByCompany: { [key: string]: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number } } = {};

    this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
      const { categoria, totalResults } = row;

      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: categoria,
          data: [],
          backgroundColor: [this.backgroundColorCategorias[index]],
          borderColor: [this.borderColorCategorias[index]],
          borderWidth: 1
        };
      }

      datasetsByCompany[categoria].data[index] = totalResults;
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCategorias[index];
      datasetsByCompany[categoria].borderColor[index] = this.borderColorCategorias[index];
    });

    
    this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria);
    this.chart.data.datasets = Object.values(datasetsByCompany);
    
    this.chart.update(); 
  }

  //Método que nos actualiza los valores del chart  
  private actualizarValoresChart(categoria: string, totalResults: number) {
    //Comprobamos la categoría
    const existingData = this.apiData.find(item => item.categoria === categoria);

    if (existingData) {
      
      existingData.totalResults = totalResults;//Si existe la categoría , actualizamos los resultados
    } else {
      
      this.apiData.push({ categoria, totalResults });//Si no existe la categoría , la introducimos en apidata con sus resultados
    }
  }

}
