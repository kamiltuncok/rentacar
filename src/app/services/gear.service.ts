import { Gear } from './../models/gear';
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class GearService {

 

  apiUrl="https://localhost:44306/api/gears/"

  constructor(private httpClient:HttpClient) { }

  getGears():Observable<ListResponseModel<Gear>>{
    let newPath=this.apiUrl+"getall";
   return this.httpClient
    .get<ListResponseModel<Gear>>(newPath)
   }
   add(gear:Gear):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"add",gear)
  }
  getGearById(gearId:number) : Observable<SingleResponseModel<Gear>>{
    let newPath=this.apiUrl+"getbyid?gearId="+gearId
    return this.httpClient.get<SingleResponseModel<Gear>>(newPath);
  }

  getGearsById(gearId:number) : Observable<ListResponseModel<Gear>>{
    let newPath=this.apiUrl+"getlistbyid?gearId="+gearId
    return this.httpClient.get<ListResponseModel<Gear>>(newPath);
  }

  update(gear:Gear): Observable<ResponseModel>{
    let newUrl = this.apiUrl+"update"
    return this.httpClient.post<ResponseModel>(newUrl, gear)
  }
}