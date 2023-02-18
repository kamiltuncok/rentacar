import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CarImage } from 'src/app/models/carImage';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent {
  carDetails:CarDetail[]=[]
  carDetail: CarDetail;
  carImage:CarImage;
  dataLoaded=false;
  apiUrl="https://localhost:44306/";
  defaultImagePath = 'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/homepage/featured-models/xc90-recharge-desktop-4x3.jpg?h=1440&iar=0&w=1920';

  constructor(
    private carDetailService:CarService,
    private carImageService:CarImageService,
    private activatedRoute:ActivatedRoute,
    private toastrService:ToastrService){}

  ngOnInit():void{
    this.activatedRoute.params.subscribe(params=> {  
      this.getCarById(params["carId"]);
      this.getCarImageByCarId(params["carId"]);
    })
  }
  
   getCarById(carId:number){
     this.carDetailService.getCarDetailById(carId).subscribe(response=>{
      this.carDetail=response.data;
      this.dataLoaded=true
     })
   }
  getCarImageByCarId(carId:number){
    this.carImageService.getCarImagesByCarId(carId).subscribe(response=>{
      this.carImage = response?.data[0];
      this.dataLoaded=true;  
    })
  }
  getImagePath(carImage: CarImage):string {
    let url:string=carImage.imagePath
    return  url;
  }

}
