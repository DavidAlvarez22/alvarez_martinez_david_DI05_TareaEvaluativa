import { Component, Input, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.scss'],
})
export class TablasComponent  implements OnInit {

 @Input() datosTabla: any[] = [];
  constructor() { }

  ngOnInit() {}

}