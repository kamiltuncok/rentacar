<<<<<<< HEAD
=======
import { ResponseModel } from './../models/responseModel';
>>>>>>> 88816fa (location and car component added)
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Rental } from '../models/rental';
import { RentalDetail } from '../models/rentalDetail';


@Injectable({
  providedIn: 'root'
})
export class RentalService {

 

  apiUrl="https://localhost:44306/api/"

  constructor(private httpClient:HttpClient) { }

  getRentalDetails():Observable<ListResponseModel<RentalDetail>>{
    let newPath=this.apiUrl+"rentals/getrentaldetails";
   return this.httpClient
    .get<ListResponseModel<RentalDetail>>(newPath)
   }
<<<<<<< HEAD
=======

   add(rental:Rental):Observable<ResponseModel>{
    return this.httpClient.post<ResponseModel>(this.apiUrl+"rentals/add",rental)
  }
>>>>>>> 88816fa (location and car component added)
}