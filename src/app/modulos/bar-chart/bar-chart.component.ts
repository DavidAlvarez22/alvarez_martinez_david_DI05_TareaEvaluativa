import { MiServicioService } from './../../servicios/mi-servicio.service';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent  implements OnInit {
  @Input() nombresCategorias: string[] = [];
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];

  public chart!: Chart;
 
  public apiData: { categoria: string; totalResults: number }[] = [];
 
  constructor(private servicio: MiServicioService,private elementRef : ElementRef, private renderer :Renderer2) { }

  ngOnInit() {
    this.inicializarChart();

    this.servicio.datos$.subscribe((datos) => {
      if (datos != undefined) {

        this.actualizarChart();
      }
    });

  }

  private inicializarChart() {
    const datasetsByCompany: { [key: string]:
      {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
      } 
    } = {};
  
    if (!this.chart) {
      this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
        const { categoria, totalResults } = row;
  
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
  
      const datasets = Object.values(datasetsByCompany);
      const canvas = this.renderer.createElement('canvas');
      this.renderer.setAttribute(canvas, 'id', 'bar-chart');
      const container = this.elementRef.nativeElement.querySelector('#contenedor-barchart');
      this.renderer.appendChild(container, canvas);
  
      this.chart = new Chart(canvas, {
        type: 'bar' as ChartType,
        data: {
          labels: this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria),
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
    } else {
      this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria);
      this.chart.data.datasets = Object.values(datasetsByCompany);
      this.chart.update();
    }
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

  
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

}
