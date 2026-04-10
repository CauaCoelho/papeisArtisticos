import { Observable } from "rxjs";
import { Capa } from "../models/capa.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})  
export class CapaService {
     private api = 'https://localhost:8080/capas';

    constructor(private httpClient : HttpClient) {}

    getCapas(): Observable<Capa[]>{
        return this.httpClient.get<Capa[]>(this.api);
    }


    buscarPorId(id: string): Observable<Capa> {
        return this.httpClient.get<Capa>(`${this.api}/{id}`);
    }


}
