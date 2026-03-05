import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { User } from '../models/user';
import { UserNamesUpdateDto } from '../models/customer-detail.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = "https://localhost:44306/api/";

  constructor(private httpClient: HttpClient) { }

  updateUserNames(dto: UserNamesUpdateDto): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + 'users/update-names', dto);
  }


  getUserById(userId: number): Observable<SingleResponseModel<User>> {
    let newUrl = this.apiUrl + "users/" + userId;
    return this.httpClient.get<SingleResponseModel<User>>(newUrl);
  }
}
