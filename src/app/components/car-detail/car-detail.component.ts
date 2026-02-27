import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CarImage } from 'src/app/models/carImage';
import { CarImageService } from 'src/app/services/car-image.service';
import { CarService } from 'src/app/services/car.service';
import { NgIf, UpperCasePipe, CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css'],
  imports: [NgIf, RouterLink, UpperCasePipe, CurrencyPipe, DecimalPipe]
})
export class CarDetailComponent implements OnInit {
  carDetail: CarDetail;
  carImage: CarImage;
  dataLoaded = false;
  apiUrl = 'https://localhost:44306/Uploads/Images/';
  defaultImagePath = 'assets/images/lux.jpg';

  constructor(
    private carDetailService: CarService,
    private carImageService: CarImageService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.getCarById(params['carId']);
    });
  }

  getCarById(carId: number) {
    this.carDetailService.getCarDetailById(carId).subscribe(response => {
      this.carDetail = response.data;
      this.dataLoaded = true;
      this.getCarImageByColorAndBrandId(this.carDetail.brandId, this.carDetail.colorId);
    });
  }

  getCarImageByColorAndBrandId(brandId: number, colorId: number) {
    this.carImageService.getCarImagesColorAndBrandId(brandId, colorId).subscribe(response => {
      this.carImage = response.data;
      this.dataLoaded = true;
    });
  }

  getImagePath(carImage: CarImage): string {
    return this.apiUrl + carImage.imagePath;
  }
}
