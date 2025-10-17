import { Segment } from './../models/segment';
import { ResponseModel } from './../models/responseModel';
import { SingleResponseModel } from './../models/singleResponseModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class SegmentService {

  apiUrl = "https://localhost:44306/api/segments/";

  constructor(private httpClient: HttpClient) { }

  getSegments(): Observable<ListResponseModel<Segment>> {
    let newPath = this.apiUrl + "getall";
    return this.httpClient.get<ListResponseModel<Segment>>(newPath);
  }

  add(segment: Segment): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "add", segment);
  }

  getSegmentById(segmentId: number): Observable<SingleResponseModel<Segment>> {
    let newPath = this.apiUrl + "getbyid?segmentId=" + segmentId;
    return this.httpClient.get<SingleResponseModel<Segment>>(newPath);
  }

  update(segment: Segment): Observable<ResponseModel> {
    let newUrl = this.apiUrl + "update";
    return this.httpClient.post<ResponseModel>(newUrl, segment);
  }
}
