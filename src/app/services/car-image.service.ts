import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarImage } from '../models/carImage';
import { ListResponseModel } from '../models/listResponseModel';
import { SingleResponseModel } from './../models/singleResponseModel';
import { ResponseModel } from './../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class CarImageService {

  apiURL = "https://localhost:44306/api/";

  constructor(private httpClient: HttpClient) { }

  getCarImages(): Observable<ListResponseModel<CarImage>> {
    let newPath = this.apiURL + "carimages/getall";
    return this.httpClient.get<ListResponseModel<CarImage>>(newPath);    
  }

  getCarImagesByCarId(carId: number): Observable<ListResponseModel<CarImage>> {
    let newPath = this.apiURL + "carimages/getbycarid?carId=" + carId;
    return this.httpClient.get<ListResponseModel<CarImage>>(newPath);     
  }

  add(formData: FormData): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiURL + 'carimages/add', formData);
  }

  getCarImagesColorAndBrandId(brandId: number, colorId: number): Observable<SingleResponseModel<CarImage>> {
    let newPath = this.apiURL + `carimages/getcarimagebycolorandbrandid?brandId=${brandId}&colorId=${colorId}`;
    return this.httpClient.get<SingleResponseModel<CarImage>>(newPath);
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.apiURL}carimages/add`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req);
  }

  getFiles(): Observable<any> {
    return this.httpClient.get(`${this.apiURL}carimages/getall`);
  }
}
