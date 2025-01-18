import { CorporateCustomer } from './../models/corporateCustomer';
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CorporateCustomerService {

 

  apiUrl="https://localhost:44306/api/corporatecustomers/"

  constructor(private httpClient:HttpClient) { }

  getCustomers():Observable<ListResponseModel<CorporateCustomer>>{
    let newPath=this.apiUrl+"getall";
   return this.httpClient
    .get<ListResponseModel<CorporateCustomer>>(newPath)
   }
   add(corporateCustomer:CorporateCustomer):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"add",corporateCustomer)
  }
  getCustomerById(customerId:number) : Observable<SingleResponseModel<CorporateCustomer>>{
    let newPath=this.apiUrl+"getbyid?customerid="+customerId
    return this.httpClient.get<SingleResponseModel<CorporateCustomer>>(newPath);
  }

  getCustomersById(customerId:number) : Observable<ListResponseModel<CorporateCustomer>>{
    let newPath=this.apiUrl+"getlistbyid?customerid="+customerId
    return this.httpClient.get<ListResponseModel<CorporateCustomer>>(newPath);
  }

  update(corporateCustomer:CorporateCustomer): Observable<ResponseModel>{
    let newUrl = this.apiUrl+"update"
    return this.httpClient.post<ResponseModel>(newUrl, corporateCustomer)
  }
}