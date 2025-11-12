import { CustomerType } from './../models/rental';
import { RegisterForCorporateModel } from './../models/registerForCorporateModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginModel } from '../models/loginModel';
import { RegisterModel } from '../models/registerModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { UserPasswordModel } from '../models/userPasswordModel';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient,
    private localStorageService:LocalStorageService,
    private jwtHelperService: JwtHelperService) { }

  apiUrl="https://localhost:44306/api/auth/"

  login(loginModel:LoginModel){
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"login",loginModel)
  }

  loginForCorporate(loginModel:LoginModel){
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"loginforcorporate",loginModel)
  }

  logOut(){
    this.localStorageService.remove("token");
  }

  register(registerModel:RegisterModel){
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"register",registerModel)
  }

  registerForCorporate(registerForCorporateModel:RegisterForCorporateModel){
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl+"registerforcorporate",registerForCorporateModel)
  }

  updatePassword(userPasswordModel:UserPasswordModel){
    let newUrl = this.apiUrl + "updatepassword";
    return this.httpClient.post<ResponseModel>(newUrl, userPasswordModel)
  }

  isAuthenticated(){
    if (localStorage.getItem("token")) {
      return true;
    }
    else{
      return false;
    }
  }

  get getDecodedToken() {
    let token = this.localStorageService.getItem("token");
    const decodedToken = this.jwtHelperService.decodeToken(token);
    return decodedToken;
  }
  

  get getCurrentUserId() {
    let decodedToken = this.getDecodedToken;
    let userIdString = Object.keys(decodedToken).filter((t) =>
      t.endsWith('/nameidentifier')
    )[0];
    let userId: number = decodedToken[userIdString];
    return userId;
  }

  getCustomerType(): string | null {
    const decodedToken = this.getDecodedToken;
    const customerType = decodedToken['customerType'];
  
    if (!customerType) {
      console.error('CustomerType bilgisi alınamadı.');
      return null;
    }
  
    return customerType;
  }

  registerAdmin(registerModel: RegisterModel) {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl + "registeradmin", registerModel);
  }


  isAdmin(): boolean {
    const customerType = this.getCustomerType();
    return customerType === 'Admin';
  }

  isLocationManager(): boolean {
    const customerType = this.getCustomerType();
    return customerType === 'LocationManager';
  }
  
  
}
