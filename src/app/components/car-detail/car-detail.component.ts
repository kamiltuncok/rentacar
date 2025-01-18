<<<<<<< HEAD
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
=======
import { CarDetail } from './../../models/carDetail';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
>>>>>>> 88816fa (location and car component added)
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
<<<<<<< HEAD
  carDetails:CarDetail[]=[]
  carDetail: CarDetail;
  carImage:CarImage;
  dataLoaded=false;
  apiUrl="https://localhost:44306/";
  defaultImagePath = 'https://www.volvocars.com/images/v/-/media/project/contentplatform/data/media/homepage/featured-models/xc90-recharge-desktop-4x3.jpg?h=1440&iar=0&w=1920';
=======
  carDetail: CarDetail;
  carImage:CarImage;
  dataLoaded=false;
  apiUrl="https://localhost:44306/Uploads/Images/";
  defaultImagePath = 'https://www.araba.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Ftasit-com%2Fimages%2Ff_webp%2Cq_auto%2Fv1694162148%2Fmg-araba-modelleri%2Fmg-araba-modelleri.webp%3F_i%3DAA&w=3840&q=75';
>>>>>>> 88816fa (location and car component added)

  constructor(
    private carDetailService:CarService,
    private carImageService:CarImageService,
    private activatedRoute:ActivatedRoute,
    private toastrService:ToastrService){}

  ngOnInit():void{
    this.activatedRoute.params.subscribe(params=> {  
      this.getCarById(params["carId"]);
<<<<<<< HEAD
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
=======
    })
  }
  
  getCarById(carId: number) {
    this.carDetailService.getCarDetailById(carId).subscribe(response => {
      this.carDetail = response.data;
      this.dataLoaded = true;
      // After getting the car details, call the method to get car images by color and brand ID
      this.getCarImageByColorAndBrandId(this.carDetail.brandId, this.carDetail.colorId);
    })
  }

  getCarImageByColorAndBrandId(brandId:number,colorId:number){
    this.carImageService.getCarImagesColorAndBrandId(brandId,colorId).subscribe(response=>{
      this.carImage = response.data;
      this.dataLoaded=true;
       this.getImagePath(this.carImage);
    })
  }

  getImagePath(carImage: CarImage):string {
    let url:string="https://localhost:44306/Uploads/Images/" + carImage.imagePath
>>>>>>> 88816fa (location and car component added)
    return  url;
  }

}
