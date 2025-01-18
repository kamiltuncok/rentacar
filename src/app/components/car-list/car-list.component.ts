import { ToastrService } from 'ngx-toastr';
import { CarImageService } from './../../services/car-image.service';
import { CarImage } from './../../models/carImage';
import { CarDetail } from './../../models/carDetail';
import { CarService } from 'src/app/services/car.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent {
  carDetails: CarDetail[] = [];
  locationName: string;
  locationEndName: string;
  startTime: string = '';
  endTime: string = '';
  gun: string = '';
  from: string = '';
  to: string = '';
  dataLoaded = false;
  apiUrl = "https://localhost:44306/Uploads/Images/";
  defaultImagePath = 'https://www.araba.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Ftasit-com%2Fimages%2Ff_webp%2Cq_auto%2Fv1694162148%2Fmg-araba-modelleri%2Fmg-araba-modelleri.webp%3F_i%3DAA&w=3840&q=75';
  customerType: number; // Customer type to distinguish between individual and corporate

  constructor(
    private carDetailService: CarService,
    private carImageService: CarImageService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      // Retrieve query parameters
      this.locationName = queryParams["locationName"];
      this.locationEndName = queryParams["locationEndName"];
      this.from = queryParams["from"];
      this.to = queryParams["to"];
      this.startTime = queryParams["startTime"];
      this.endTime = queryParams["endTime"];
      this.gun = queryParams["gun"];
      this.customerType = +queryParams["customerType"]; // Get customer type
  
      // Now you have the correct values from query parameters
      this.getCarByLocationName(this.locationName);
    });
  }

  getCarByLocationName(locationName: string) {
    this.carDetailService.getCarsByLocationName(locationName).subscribe(response => {
      this.carDetails = response.data;
      this.dataLoaded = true;

      // Iterate through the carDetails to get images for each car
      for (const car of this.carDetails) {
        this.getCarImageByColorAndBrandId(car.brandId, car.colorId, car);
      }
    });
  }

  getCarImageByColorAndBrandId(brandId: number, colorId: number, car: CarDetail) {
    this.carImageService.getCarImagesColorAndBrandId(brandId, colorId).subscribe(response => {
      const carImage: CarImage = response.data; // Remove the array declaration
      car.imagePath = [carImage]; // Assign the single image to the car object as an array
    });
  }

  getImagePath(car: CarDetail): string {
    if (car && car.imagePath && car.imagePath.length > 0) {
      const firstImage = car.imagePath[0];
      if (firstImage && firstImage.imagePath) {
        return this.apiUrl + firstImage.imagePath;
      }
    }
    return this.defaultImagePath;
  }

  navigateToPayment(carId: number) {
    const routePath = this.customerType === 0 ? 'payment' : 'paymentcorporate'; // Determine route based on customer type
    this.router.navigate([routePath, carId], {
      relativeTo: this.activatedRoute,
      queryParams: this.activatedRoute.snapshot.queryParams,
    });
  }
}
