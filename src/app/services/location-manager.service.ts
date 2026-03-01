import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { LocationManager } from '../models/locationManager';
import { LocationManagerAdd } from '../models/locationManagerAdd';
import { LocationManagerUpdate } from '../models/locationManagerUpdate';
@Injectable({
    providedIn: 'root'
})
export class LocationManagerService {
    private apiUrl = 'https://localhost:44306/api/locationmanagers/';

    constructor(private httpClient: HttpClient) { }

    getLocationManagers(): Observable<ListResponseModel<LocationManager>> {
        return this.httpClient.get<ListResponseModel<LocationManager>>(this.apiUrl + 'getall');
    }

    addLocationManager(dto: LocationManagerAdd): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(this.apiUrl + 'add', dto);
    }

    updateLocationManager(dto: LocationManagerUpdate): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(this.apiUrl + 'update', dto);
    }

    revokeLocationManager(userId: number, locationId: number): Observable<ResponseModel> {
        return this.httpClient.post<ResponseModel>(`${this.apiUrl}revoke?userId=${userId}&locationId=${locationId}`, {});
    }
}
