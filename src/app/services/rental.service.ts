import { ResponseModel } from './../models/responseModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Rental } from '../models/rental';
import { RentalDetail } from '../models/rentalDetail';

export interface RentalCreateRequestDto {
  carId: number;
  startLocationId: number;
  endLocationId: number;
  startDate: string;
  endDate: string;
}

export interface GuestRentalCreateRequestDto extends RentalCreateRequestDto {
  firstName?: string;
  lastName?: string;
  identityNumber?: string;
  email: string;
  phoneNumber?: string;
  companyName?: string;
  taxNumber?: string;
}

export interface RentalResponseDto {
  rentalId: number;
  totalPrice: number;
}

export interface CarAvailabilityFilterDto {
  startLocationId: number;
  endLocationId: number;
  startDate: string;
  endDate: string;
  fuelIds?: number[];
  gearIds?: number[];
  segmentIds?: number[];
}


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


  createRental(request: RentalCreateRequestDto): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "rentals/create", request);
  }

  createGuestRental(request: GuestRentalCreateRequestDto): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "rentals/createguest", request);
  }

  getRentalDetailsByUserId(userId: number): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "rentals/getrentalsbyuserid?userId=" + userId;
    return this.httpClient
      .get<ListResponseModel<RentalDetail>>(newPath)
  }

  getRentalsByManagerLocation(userId: number): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "rentals/getrentalsbymanagerlocation?userId=" + userId;
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