import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CarImage } from 'src/app/models/carImage';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';
import { NgIf, UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-car-detail',
    templateUrl: './car-detail.component.html',
    styleUrls: ['./car-detail.component.css'],
    imports: [NgIf, RouterLink, UpperCasePipe]
})
export class CarDetailComponent {
  carDetails: CarDetail[] = [];
  carDetail: CarDetail;
  carImage: CarImage;
  dataLoaded = false;
  apiUrl = "https://localhost:44306/Uploads/Images/";
  defaultImagePath = 'https://www.araba.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Ftasit-com%2Fimages%2Ff_webp%2Cq_auto%2Fv1694162148%2Fmg-araba-modelleri%2Fmg-araba-modelleri.webp%3F_i%3DAA&w=3840&q=75';

  constructor(
    private carDetailService: CarService,
    private carImageService: CarImageService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {  
      this.getCarById(params["carId"]);
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

  getCarImageByColorAndBrandId(brandId: number, colorId: number) {
    this.carImageService.getCarImagesColorAndBrandId(brandId, colorId).subscribe(response => {
      this.carImage = response.data;
      this.dataLoaded = true;
      this.getImagePath(this.carImage);
    })
  }

  getImagePath(carImage: CarImage): string {
    let url: string = "https://localhost:44306/Uploads/Images/" + carImage.imagePath;
    return url;
  }
}
