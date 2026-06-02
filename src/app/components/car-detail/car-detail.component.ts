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
      this.getCarImagesByCarId(carId);
    });
  }

  getCarImagesByCarId(carId: number) {
    this.carImageService.getCarImagesByCarId(carId).subscribe(response => {
      if (response.data && response.data.length > 0) {
        this.carImage = response.data[0];
      }
      this.dataLoaded = true;
    });
  }

  getImagePath(carImage: CarImage): string {
    if (carImage && carImage.imagePath) {
      if (carImage.imagePath.startsWith('http://') || carImage.imagePath.startsWith('https://')) {
        return carImage.imagePath;
      }
      return this.apiUrl + carImage.imagePath;
    }
    return this.defaultImagePath;
  }
}
