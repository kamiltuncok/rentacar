import { CorporateUser } from './../models/corporateUser';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CorporateUserService {

  apiUrl = "https://localhost:44306/api/corporateusers/";

  constructor(private httpClient:HttpClient) { }

  updateUserNames(corporateUser:CorporateUser){
    let newUrl = this.apiUrl + "updateusernames";
    return this.httpClient.post<ResponseModel>(newUrl,corporateUser);
  }


  getUserById(userId:number):Observable<SingleResponseModel<CorporateUser>>{
    let newUrl = this.apiUrl + "getbyid?userId=" + userId;
    return this.httpClient.get<SingleResponseModel<CorporateUser>>(newUrl);
  }
}
