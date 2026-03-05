import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { CustomerDetail } from '../models/customer-detail.model';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  readonly apiUrl = 'https://localhost:44306/api/';

  constructor(private httpClient: HttpClient) { }

  getCustomers(): Observable<ListResponseModel<Customer>> {
    return this.httpClient.get<ListResponseModel<Customer>>(this.apiUrl + 'customers');
  }

  add(customer: Customer): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + 'customers', customer);
  }

  getCustomerById(customerId: number): Observable<SingleResponseModel<Customer>> {
    return this.httpClient.get<SingleResponseModel<Customer>>(`${this.apiUrl}customers/${customerId}`);
  }

  getCustomerDetailById(customerId: number): Observable<SingleResponseModel<CustomerDetail>> {
    return this.httpClient.get<SingleResponseModel<CustomerDetail>>(`${this.apiUrl}customers/detail/${customerId}`);
  }

  update(customer: Customer): Observable<ResponseModel> {
    return this.httpClient.put<ResponseModel>(`${this.apiUrl}customers/${customer.id}`, customer);
  }

  delete(customerId: number): Observable<ResponseModel> {
    return this.httpClient.delete<ResponseModel>(`${this.apiUrl}customers/${customerId}`);
  }
}

