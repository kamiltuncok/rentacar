import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  apiUrl = "https://localhost:44306/api/";

  constructor(private httpClient: HttpClient) { }

  getCustomers(): Observable<ListResponseModel<Customer>> {
    const newPath = this.apiUrl + "customers/getall";
    return this.httpClient.get<ListResponseModel<Customer>>(newPath);
  }

  add(customer: Customer): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "customers/add", customer);
  }

  getCustomerById(customerId: number): Observable<SingleResponseModel<Customer>> {
    const newPath = this.apiUrl + "customers/getbyid?customerid=" + customerId;
    return this.httpClient.get<SingleResponseModel<Customer>>(newPath);
  }

  getCustomersById(customerId: number): Observable<ListResponseModel<Customer>> {
    const newPath = this.apiUrl + "customers/getlistbyid?customerid=" + customerId;
    return this.httpClient.get<ListResponseModel<Customer>>(newPath);
  }

  update(customer: Customer): Observable<ResponseModel> {
    const newUrl = this.apiUrl + "customers/update";
    return this.httpClient.post<ResponseModel>(newUrl, customer);
  }
}
