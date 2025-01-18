<<<<<<< HEAD
<<<<<<< HEAD
=======
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';
>>>>>>> 88816fa (location and car component added)
=======
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';
>>>>>>> 88816fa (location and car component added)
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

 

  apiUrl="https://localhost:44306/api/"

  constructor(private httpClient:HttpClient) { }

  getCustomers():Observable<ListResponseModel<Customer>>{
    let newPath=this.apiUrl+"customers/getall";
   return this.httpClient
    .get<ListResponseModel<Customer>>(newPath)
   }
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 88816fa (location and car component added)
   add(customer:Customer):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"customers/add",customer)
  }
  getCustomerById(customerId:number) : Observable<SingleResponseModel<Customer>>{
    let newPath="https://localhost:44306/api/customers/getbyid?customerid="+customerId
    return this.httpClient.get<SingleResponseModel<Customer>>(newPath);
  }

  getCustomersById(customerId:number) : Observable<ListResponseModel<Customer>>{
    let newPath="https://localhost:44306/api/customers/getlistbyid?customerid="+customerId
    return this.httpClient.get<ListResponseModel<Customer>>(newPath);
  }

  update(customer:Customer): Observable<ResponseModel>{
    let newUrl = "https://localhost:44306/api/customers/update"
    return this.httpClient.post<ResponseModel>(newUrl, customer)
  }
<<<<<<< HEAD
>>>>>>> 88816fa (location and car component added)
=======
>>>>>>> 88816fa (location and car component added)
}