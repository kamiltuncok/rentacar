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

  apiUrl = "https://localhost:44306/api/";

  constructor(private httpClient: HttpClient) { }

  getSegments(): Observable<ListResponseModel<Segment>> {
    let newPath = this.apiUrl + "segments";
    return this.httpClient.get<ListResponseModel<Segment>>(newPath);
  }

  add(segment: Segment): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "segments", segment);
  }

  getSegmentById(segmentId: number): Observable<SingleResponseModel<Segment>> {
    let newPath = this.apiUrl + "segments/" + segmentId;
    return this.httpClient.get<SingleResponseModel<Segment>>(newPath);
  }

  update(segment: Segment): Observable<ResponseModel> {
    return this.httpClient.put<ResponseModel>(this.apiUrl + "segments/" + segment.segmentId, segment);
  }
}
