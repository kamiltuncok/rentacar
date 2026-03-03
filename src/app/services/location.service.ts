import { Observable } from 'rxjs';
import { Location } from './../models/location';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  apiUrl = "https://localhost:44306/api/"

  constructor(private httpClient: HttpClient) { }

  getLocations(): Observable<ListResponseModel<Location>> {
    let newPath = this.apiUrl + "locations";
    return this.httpClient
      .get<ListResponseModel<Location>>(newPath)
  }

  add(location: Location): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "locations", location)
  }

  getLocationsById(locationId: number): Observable<ListResponseModel<Location>> {
    let newPath = this.apiUrl + "locations/" + locationId;
    return this.httpClient.get<ListResponseModel<Location>>(newPath);
  }

  update(location: Location): Observable<ResponseModel> {
    return this.httpClient.put<ResponseModel>(this.apiUrl + "locations/" + location.id, location);
  }

  getLocationsByCity(locationCityId: number): Observable<ListResponseModel<Location>> {
    let newPath = this.apiUrl + "locations/city/" + locationCityId
    return this.httpClient.get<ListResponseModel<Location>>(newPath);
  }

  getCities(): Observable<ListResponseModel<{ id: number, name: string }>> {
    let newPath = this.apiUrl + "locationcities";
    return this.httpClient.get<ListResponseModel<{ id: number, name: string }>>(newPath);
  }
}
