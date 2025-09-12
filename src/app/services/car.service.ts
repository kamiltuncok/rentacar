import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarDetail } from '../models/carDetail';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';
import { SingleResponseModel } from '../models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CarService {

 

  apiUrl="https://localhost:44306/api/"

  constructor(private httpClient:HttpClient) { }

  getCarDetails():Observable<ListResponseModel<CarDetail>>{
    let newPath=this.apiUrl+"cars/getcardetails";
   return this.httpClient
    .get<ListResponseModel<CarDetail>>(newPath)
   }
   getCarsByBrandId(brandId:number):Observable<ListResponseModel<CarDetail>>{
    let newPath=this.apiUrl+"cars/getbybrands?brandId="+brandId
    return this.httpClient
     .get<ListResponseModel<CarDetail>>(newPath)
    }
    getCarsByColorId(colorId:number):Observable<ListResponseModel<CarDetail>>{
      let newPath=this.apiUrl+"cars/getbycolors?colorId="+colorId
      return this.httpClient
       .get<ListResponseModel<CarDetail>>(newPath)
      }
<<<<<<< HEAD
=======
      getCarsByLocationId(locationId:number):Observable<ListResponseModel<CarDetail>>{
        let newPath=this.apiUrl+"cars/getbylocations?locationId="+locationId
        return this.httpClient
         .get<ListResponseModel<CarDetail>>(newPath)
        }
        getCarsByLocationName(locationName:string):Observable<ListResponseModel<CarDetail>>{
          let newPath=this.apiUrl+"cars/getcarsnotrentedbylocations?locationName="+locationName
          return this.httpClient
           .get<ListResponseModel<CarDetail>>(newPath)
          }
>>>>>>> 88816fa (location and car component added)
      getCarsByCarId(carId:number):Observable<ListResponseModel<CarDetail>>{
        let newPath=this.apiUrl+"cars/getbyid?id="+carId;
        return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
      }
       getCarDetailById(carId:number): Observable<SingleResponseModel<CarDetail>>{
        let newPath = this.apiUrl + "cars/getbycarid?carId=" + carId;
        return this.httpClient.get<SingleResponseModel<CarDetail>>(newPath);
      }
      add(car:CarDetail):Observable<ResponseModel>{
        return this.httpClient.post<ResponseModel>(this.apiUrl+"cars/add",car)
      }
      getCarsById(id:number) : Observable<ListResponseModel<CarDetail>>{
        let newPath="https://localhost:44306/api/cars/getbyid?id="+id
        return this.httpClient.get<ListResponseModel<CarDetail>>(newPath);
      }
    
      update(car:CarDetail): Observable<ResponseModel>{
        let newUrl = "https://localhost:44306/api/cars/update"
        return this.httpClient.post<ResponseModel>(newUrl, car)
      }

<<<<<<< HEAD

=======
      carisrented(carId: number): Observable<any> {
  let newPath = `${this.apiUrl}cars/carisrented?carId=${carId}`;
  return this.httpClient.post(newPath, {});
}

      
>>>>>>> 88816fa (location and car component added)

}
    
