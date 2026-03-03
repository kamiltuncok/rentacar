import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brand';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  apiUrl = "https://localhost:44306/api/"

  constructor(private httpClient: HttpClient) { }

  getBrands(): Observable<ListResponseModel<Brand>> {
    let newPath = this.apiUrl + "brands";
    return this.httpClient
      .get<ListResponseModel<Brand>>(newPath)
  }

  add(brand: Brand): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "brands", brand)
  }

  getBrandsById(brandId: number): Observable<ListResponseModel<Brand>> {
    let newPath = this.apiUrl + "brands/" + brandId;
    return this.httpClient.get<ListResponseModel<Brand>>(newPath);
  }

  update(brand: Brand): Observable<ResponseModel> {
    return this.httpClient.put<ResponseModel>(this.apiUrl + "brands/" + brand.brandId, brand);
  }
}