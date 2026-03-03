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
    const newPath = this.apiUrl + "customers";
    return this.httpClient.get<ListResponseModel<Customer>>(newPath);
  }

  add(customer: Customer): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "customers", customer);
  }

  getCustomerById(customerId: number): Observable<SingleResponseModel<Customer>> {
    const newPath = this.apiUrl + "customers/" + customerId;
    return this.httpClient.get<SingleResponseModel<Customer>>(newPath);
  }

  getCustomerDetailById(customerId: number): Observable<SingleResponseModel<any>> {
    const newPath = this.apiUrl + "customers/detail/" + customerId;
    return this.httpClient.get<SingleResponseModel<any>>(newPath);
  }

  update(customer: Customer): Observable<ResponseModel> {
    const newUrl = this.apiUrl + "customers/" + customer.id;
    return this.httpClient.put<ResponseModel>(newUrl, customer);
  }

  delete(customerId: number): Observable<ResponseModel> {
    return this.httpClient.delete<ResponseModel>(this.apiUrl + "customers/" + customerId);
  }
}
