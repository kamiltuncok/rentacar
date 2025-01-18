import { Observable } from 'rxjs';
import { Location } from './../models/location';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  apiUrl="https://localhost:44306/api/"

  constructor(private httpClient:HttpClient) { }

  getLocations():Observable<ListResponseModel<Location>>{
    let newPath=this.apiUrl+"locations/getall";
   return this.httpClient
    .get<ListResponseModel<Location>>(newPath)
   }
   add(location:Location):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"locations/add",location)
  }
  getLocationsById(locationId:number) : Observable<ListResponseModel<Location>>{
    let newPath="https://localhost:44306/api/locations/getbyid?locationid="+locationId
    return this.httpClient.get<ListResponseModel<Location>>(newPath);
  }

  update(location:Location): Observable<ResponseModel>{
    let newUrl = "https://localhost:44306/api/locations/update"
    return this.httpClient.post<ResponseModel>(newUrl, location)
  }

  getLocationsByCity(locationCity:string) : Observable<ListResponseModel<Location>>{
    let newPath="https://localhost:44306/api/locations/getbylocationcity?locationCity="+locationCity
    return this.httpClient.get<ListResponseModel<Location>>(newPath);
  }
}
