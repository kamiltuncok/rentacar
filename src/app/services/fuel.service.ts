import { Fuel } from './../models/fuel';
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class FuelService {

 

  apiUrl="https://localhost:44306/api/fuels/"

  constructor(private httpClient:HttpClient) { }

  getFuels():Observable<ListResponseModel<Fuel>>{
    let newPath=this.apiUrl+"getall";
   return this.httpClient
    .get<ListResponseModel<Fuel>>(newPath)
   }
   add(fuel:Fuel):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"add",fuel)
  }
  getFuelById(fuelId:number) : Observable<SingleResponseModel<Fuel>>{
    let newPath=this.apiUrl+"getbyid?fuelId="+fuelId
    return this.httpClient.get<SingleResponseModel<Fuel>>(newPath);
  }

  getFuelsById(fuelId:number) : Observable<ListResponseModel<Fuel>>{
    let newPath=this.apiUrl+"getlistbyid?fuelId="+fuelId
    return this.httpClient.get<ListResponseModel<Fuel>>(newPath);
  }

  update(fuel:Fuel): Observable<ResponseModel>{
    let newUrl = this.apiUrl+"update"
    return this.httpClient.post<ResponseModel>(newUrl, fuel)
  }
}