import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { IonicModule } from '@ionic/angular';
import { TablasComponent } from './tablas/tablas.component';
import { TablePipePipe } from '../pipes/table-pipe.pipe';



@NgModule({
  declarations: [PieChartComponent,LineChartComponent,BarChartComponent,TablasComponent,TablePipePipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[PieChartComponent,LineChartComponent,BarChartComponent,TablasComponent,TablePipePipe],
})
export class MiModuloModule { }
