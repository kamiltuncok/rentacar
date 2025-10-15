import { HttpClient,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarDetail } from '../models/carDetail';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  apiUrl = "https://localhost:44306/api/";

  constructor(private httpClient: HttpClient) { }

  getCarDetails(): Observable<ListResponseModel<CarDetail>> {
    const newPath = this.apiUrl + "cars/getcardetails";
    return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
  }

  getCarsByBrandId(brandId: number): Observable<ListResponseModel<CarDetail>> {
    const newPath = this.apiUrl + "cars/getbybrands?brandId=" + brandId;
    return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
  }

  getCarsByColorId(colorId: number): Observable<ListResponseModel<CarDetail>> {
    const newPath = this.apiUrl + "cars/getbycolors?colorId=" + colorId;
    return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
  }

  getCarsByLocationId(locationId: number): Observable<ListResponseModel<CarDetail>> {
    const newPath = this.apiUrl + "cars/getbylocations?locationId=" + locationId;
    return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
  }

  getCarsByLocationName(locationName: string): Observable<ListResponseModel<CarDetail>> {
    const newPath = this.apiUrl + "cars/getcarsnotrentedbylocations?locationName=" + locationName;
    return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
  }

  getCarsByCarId(carId: number): Observable<ListResponseModel<CarDetail>> {
    const newPath = this.apiUrl + "cars/getbyid?id=" + carId;
    return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
  }

  getCarDetailById(carId: number): Observable<SingleResponseModel<CarDetail>> {
    const newPath = this.apiUrl + "cars/getbycarid?carId=" + carId;
    return this.httpClient.get<SingleResponseModel<CarDetail>>(newPath);
  }

  add(car: CarDetail): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "cars/add", car);
  }

  getCarsById(id: number): Observable<ListResponseModel<CarDetail>> {
    const newPath = this.apiUrl + "cars/getbyid?id=" + id;
    return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
  }

  update(car: CarDetail): Observable<ResponseModel> {
    const newUrl = this.apiUrl + "cars/update";
    return this.httpClient.post<ResponseModel>(newUrl, car);
  }

  carisrented(carId: number): Observable<any> {
    const newPath = `${this.apiUrl}cars/carisrented?carId=${carId}`;
    return this.httpClient.post(newPath, {});
  }

  getCarsByFuelAndLocation(fuelId: number, locationName: string): Observable<ListResponseModel<CarDetail>> {
  const newPath = this.apiUrl + "cars/getcarsbyfuelandlocation?fuelId=" + fuelId + "&locationName=" + encodeURIComponent(locationName);
  return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
}

getCarsByGearAndLocation(gearId: number, locationName: string): Observable<ListResponseModel<CarDetail>> {
  const newPath = this.apiUrl + "cars/getcarsbygearandlocation?gearId=" + gearId + "&locationName=" + encodeURIComponent(locationName);
  return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
}

getCarsByFilters(fuelIds: number[], gearIds: number[], locationName: string): Observable<ListResponseModel<CarDetail>> {
  let params = new HttpParams();
  
  if (fuelIds && fuelIds.length > 0) {
    fuelIds.forEach(id => {
      params = params.append('fuelIds', id.toString());
    });
  }
  
  if (gearIds && gearIds.length > 0) {
    gearIds.forEach(id => {
      params = params.append('gearIds', id.toString());
    });
  }
  
  params = params.append('locationName', locationName);
  
  const newPath = this.apiUrl + "cars/getcarsbygearandfuelfilters";
  return this.httpClient.get<ListResponseModel<CarDetail>>(newPath, { params });
}
}
