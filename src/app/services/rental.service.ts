import { ResponseModel } from './../models/responseModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Rental } from '../models/rental';
import { RentalDetail } from '../models/rentalDetail';
import {
  RentalCreateRequestDto,
  GuestRentalCreateRequestDto,
  CarAvailabilityFilterDto
} from '../models/rental-dto.model';

export type { RentalCreateRequestDto, GuestRentalCreateRequestDto, CarAvailabilityFilterDto } from '../models/rental-dto.model';
export type { RentalResponseDto } from '../models/rental-dto.model';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  readonly apiUrl = 'https://localhost:44306/api/';

  constructor(private httpClient: HttpClient) { }

  getRentalDetails(): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "rentals";
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
    let newPath = this.apiUrl + "rentals/user/" + userId;
    return this.httpClient
      .get<ListResponseModel<RentalDetail>>(newPath)
  }

  getRentalsByManagerLocation(userId: number): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "rentals/manager/" + userId;
    return this.httpClient
      .get<ListResponseModel<RentalDetail>>(newPath)
  }

  getRentalsByStartDate(startDate: string): Observable<ListResponseModel<Rental>> {
    let newPath = this.apiUrl + "rentals/date-range?startDate=" + startDate + "&endDate=" + startDate; // Simplified
    return this.httpClient.get<ListResponseModel<Rental>>(newPath);
  }

  getRentalsByDateRange(startDate: string, endDate: string): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "rentals/date-range?startDate=" + startDate + "&endDate=" + endDate;
    return this.httpClient.get<ListResponseModel<RentalDetail>>(newPath);
  }

  markAsReturned(rentalId: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + "rentals/" + rentalId + "/mark-as-returned",
      {}
    );
  }

  collectDeposit(rentalId: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + "rentals/" + rentalId + "/collect-deposit",
      {}
    );
  }

  deliverVehicle(rentalId: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + "rentals/" + rentalId + "/deliver",
      {}
    );
  }

  cancelRental(rentalId: number): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(
      this.apiUrl + "rentals/" + rentalId + "/cancel",
      {}
    );
  }
}