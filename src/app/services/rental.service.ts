import { ResponseModel } from './../models/responseModel';
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



  apiUrl = "https://localhost:44306/api/"

  constructor(private httpClient: HttpClient) { }

  getRentalDetails(): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "rentals/getall";
    return this.httpClient
      .get<ListResponseModel<RentalDetail>>(newPath)
  }


  add(rental: Rental): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "rentals/add", rental)
  }

  getRentalDetailsByUserId(userId: number, customerType: number): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "rentals/getrentalsbyuserid?userId=" + userId + "&customerType=" + customerType;
    return this.httpClient
      .get<ListResponseModel<RentalDetail>>(newPath)
  }

  getRentalsByStartDate(startDate: string): Observable<ListResponseModel<Rental>> {
    let newPath = this.apiUrl + "rentals/getbystartdate?startDate=" + startDate;
    return this.httpClient.get<ListResponseModel<Rental>>(newPath);
  }

  getRentalsByEmail(email: string): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "rentals/getbyemail?email=" + encodeURIComponent(email);
    return this.httpClient.get<ListResponseModel<RentalDetail>>(newPath);
  }

  getRentalsByName(name: string): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "rentals/getbyname?name=" + encodeURIComponent(name);
    return this.httpClient.get<ListResponseModel<RentalDetail>>(newPath);
  }

  getRentalsByDateRange(startDate: string, endDate: string): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "rentals/getbydaterange?startDate=" + startDate + "&endDate=" + endDate;
    return this.httpClient.get<ListResponseModel<RentalDetail>>(newPath);
  }

  markAsReturned(rentalId: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + "rentals/markasreturned?rentalId=" + rentalId,
      {}
    );
  }

  deleteAndFreeCar(rentalId: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + "rentals/deleteandfreecardendpoint?rentalId=" + rentalId,
      {}
    );
  }
}