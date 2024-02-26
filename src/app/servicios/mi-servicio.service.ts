import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RespuestaNoticias } from '../interfaces/mi-interfaz';

@Injectable({
  providedIn: 'root'
})
export class MiServicioService {
  //Variables 
  private datosSubject: BehaviorSubject<{ categoria: string; totalResults: number }|undefined> = new BehaviorSubject<{ categoria: string; totalResults: number }|undefined>(undefined);
  public datos$: Observable<{ categoria: string; totalResults: number }|undefined> = this.datosSubject.asObservable();
  apiKey: string = environment.apiKey;
  apiUrl: string = environment.apiUrl;

  constructor(private http:HttpClient) {}

  cargarCategoria(categoria : string){
    //Creamos nuestro objeto observable
    let respuesta: Observable<RespuestaNoticias> = this.http.get<RespuestaNoticias>(this.apiUrl+"/top-headlines?country=us&category=" + categoria + "&apiKey=" + this.apiKey);
    console.log("respuesta: "+respuesta);
    respuesta.subscribe( data => {
      if (data && data.totalResults !== undefined) {
        
        this.datosSubject.next({ categoria: categoria, totalResults: data.totalResults });
      } else {
        console.error('La propiedad totalResults no está definida en la respuesta:', data);
      }
    });
  }
}
