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

 

  apiUrl="https://localhost:44306/api/"

  constructor(private httpClient:HttpClient) { }

  getBrands():Observable<ListResponseModel<Brand>>{
    let newPath=this.apiUrl+"brands/getall";
   return this.httpClient
    .get<ListResponseModel<Brand>>(newPath)
   }
   add(brand:Brand):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"brands/add",brand)
  }
  getBrandsById(brandId:number) : Observable<ListResponseModel<Brand>>{
    let newPath="https://localhost:44306/api/brands/getbyid?brandid="+brandId
    return this.httpClient.get<ListResponseModel<Brand>>(newPath);
  }

  update(brand:Brand): Observable<ResponseModel>{
    let newUrl = "https://localhost:44306/api/brands/update"
    return this.httpClient.post<ResponseModel>(newUrl, brand)
  }
  
}