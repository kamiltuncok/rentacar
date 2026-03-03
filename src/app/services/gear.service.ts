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



  apiUrl = "https://localhost:44306/api/"

  constructor(private httpClient: HttpClient) { }

  getGears(): Observable<ListResponseModel<Gear>> {
    let newPath = this.apiUrl + "gears";
    return this.httpClient
      .get<ListResponseModel<Gear>>(newPath)
  }
  add(gear: Gear): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "gears", gear)
  }
  getGearById(gearId: number): Observable<SingleResponseModel<Gear>> {
    let newPath = this.apiUrl + "gears/" + gearId;
    return this.httpClient.get<SingleResponseModel<Gear>>(newPath);
  }

  getGearsById(gearId: number): Observable<ListResponseModel<Gear>> {
    let newPath = this.apiUrl + "getlistbyid?gearId=" + gearId
    return this.httpClient.get<ListResponseModel<Gear>>(newPath);
  }

  update(gear: Gear): Observable<ResponseModel> {
    return this.httpClient.put<ResponseModel>(this.apiUrl + "gears/" + gear.gearId, gear);
  }
}