import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = "https://localhost:44306/api/";

  constructor(private httpClient:HttpClient) { }

  updateUserNames(user:User){
    let newUrl = this.apiUrl + "users/updateusernames";
    return this.httpClient.post<ResponseModel>(newUrl,user);
  }


  getUserById(userId:number):Observable<SingleResponseModel<User>>{
    let newUrl = this.apiUrl + "users/getbyid?userId=" + userId;
    return this.httpClient.get<SingleResponseModel<User>>(newUrl);
  }
}
