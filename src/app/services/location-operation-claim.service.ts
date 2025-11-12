import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { ResponseModel } from '../models/responseModel';
import { LocationOperationClaim } from '../models/locationOperationClaim';
import { RentalDetail } from '../models/rentalDetail';

@Injectable({
  providedIn: 'root'
})
export class LocationOperationClaimService {

  apiUrl = "https://localhost:44306/api/locationoperationclaims/";

  constructor(private httpClient: HttpClient) { }

  // Tüm lokasyon operasyon claim'lerini getir
  getAll(): Observable<ListResponseModel<LocationOperationClaim>> {
    let newPath = this.apiUrl + "getall";
    return this.httpClient.get<ListResponseModel<LocationOperationClaim>>(newPath);
  }

  // ID'ye göre tek bir claim getir
  getById(locationOperationClaimId: number): Observable<SingleResponseModel<LocationOperationClaim>> {
    let newPath = this.apiUrl + "getbyid?locationOperationClaimId=" + locationOperationClaimId;
    return this.httpClient.get<SingleResponseModel<LocationOperationClaim>>(newPath);
  }

  // User ID'ye göre claim'leri getir
  getByUserId(userId: number): Observable<ListResponseModel<LocationOperationClaim>> {
    let newPath = this.apiUrl + "getbyuserid?userId=" + userId;
    return this.httpClient.get<ListResponseModel<LocationOperationClaim>>(newPath);
  }

  // Location ID'ye göre claim'leri getir
  getByLocationId(locationId: number): Observable<ListResponseModel<LocationOperationClaim>> {
    let newPath = this.apiUrl + "getbylocationid?locationId=" + locationId;
    return this.httpClient.get<ListResponseModel<LocationOperationClaim>>(newPath);
  }

  // User ve Location'a göre claim getir
  getByUserAndLocation(userId: number, locationId: number): Observable<SingleResponseModel<LocationOperationClaim>> {
    let newPath = this.apiUrl + "getbyuserandlocation?userId=" + userId + "&locationId=" + locationId;
    return this.httpClient.get<SingleResponseModel<LocationOperationClaim>>(newPath);
  }

  // Kullanıcının lokasyon yöneticisi olup olmadığını kontrol et
  isUserLocationManager(userId: number, locationId: number): Observable<SingleResponseModel<boolean>> {
    let newPath = this.apiUrl + "isuserlocationmanager?userId=" + userId + "&locationId=" + locationId;
    return this.httpClient.get<SingleResponseModel<boolean>>(newPath);
  }

  // Manager'ın lokasyonlarındaki rental'ları getir
  getRentalsByManagerLocation(userId: number): Observable<ListResponseModel<RentalDetail>> {
    let newPath = this.apiUrl + "getrentalsbymanagerlocation?userId=" + userId;
    return this.httpClient.get<ListResponseModel<RentalDetail>>(newPath);
  }

  // List by ID (isteğe bağlı)
  getListById(id: number): Observable<ListResponseModel<LocationOperationClaim>> {
    let newPath = this.apiUrl + "getlistbyid?id=" + id;
    return this.httpClient.get<ListResponseModel<LocationOperationClaim>>(newPath);
  }

  // Yeni claim ekle
  add(locationOperationClaim: LocationOperationClaim): Observable<ResponseModel> {
    let newPath = this.apiUrl + "add";
    return this.httpClient.post<ResponseModel>(newPath, locationOperationClaim);
  }

  // Claim güncelle
  update(locationOperationClaim: LocationOperationClaim): Observable<ResponseModel> {
    let newPath = this.apiUrl + "update";
    return this.httpClient.post<ResponseModel>(newPath, locationOperationClaim);
  }

  // Claim sil
  delete(locationOperationClaim: LocationOperationClaim): Observable<ResponseModel> {
    let newPath = this.apiUrl + "delete";
    return this.httpClient.post<ResponseModel>(newPath, locationOperationClaim);
  }
}