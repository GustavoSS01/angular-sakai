import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CepService{
    constructor(private http:HttpClient) {}
    
    buscar(cep:string){
        return this.http.get(`https://viacep.com.br/ws/${cep}/json/`).pipe(
            catchError((error:any)=>{
                console.log(error);
                return error
            }) 
        )
    }

    buscarEstados(){
        return this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/`).pipe(
            catchError((error:any)=>{
                console.log(error);
                return error
            }) 
        )
    }

    buscarMunicipios(code:any){
        return this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${code}/municipios`).pipe(
            catchError((error:any)=>{
                console.log(error);
                return error
            }) 
        )
    }


}