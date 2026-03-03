import { IndividualCustomer } from './../models/individualCustomer';
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class IndividualCustomerService {



  apiUrl = "https://localhost:44306/api/individualcustomers/"

  constructor(private httpClient: HttpClient) { }

  getCustomers(): Observable<ListResponseModel<IndividualCustomer>> {
    let newPath = this.apiUrl;
    return this.httpClient
      .get<ListResponseModel<IndividualCustomer>>(newPath)
  }

  add(individualCustomer: IndividualCustomer): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl, individualCustomer)
  }

  getCustomerById(customerId: number): Observable<SingleResponseModel<IndividualCustomer>> {
    let newPath = this.apiUrl + customerId
    return this.httpClient.get<SingleResponseModel<IndividualCustomer>>(newPath);
  }

  update(individualCustomer: IndividualCustomer): Observable<ResponseModel> {
    let newUrl = this.apiUrl + individualCustomer.id
    return this.httpClient.put<ResponseModel>(newUrl, individualCustomer)
  }

  delete(customerId: number): Observable<ResponseModel> {
    return this.httpClient.delete<ResponseModel>(this.apiUrl + customerId);
  }
}