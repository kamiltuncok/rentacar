import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  carDetail: CarDetail[] = [];
  dataLoaded = false;
  filterText = "";

  constructor(
    private carService: CarService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params["brandId"]) {
        this.getCarsByBrandId(params["brandId"]);
      } else if (params["colorId"]) {
        this.getCarsByColorId(params["colorId"]);
      } else if (params["locationId"]) {
        this.getCarsByLocationId(params["locationId"]);
      } else {
        this.getCarDetails();
      }
    });
  }

  getCarDetails() {
    this.carService.getCarDetails().subscribe(response => {
      this.carDetail = response.data;
      this.dataLoaded = true;
    });
  }

  getCarsByBrandId(brandId: number) {
    this.carService.getCarsByBrandId(brandId).subscribe(response => {
      this.carDetail = response.data;
      this.dataLoaded = true;
    });
  }

  getCarsByColorId(colorId: number) {
    this.carService.getCarsByColorId(colorId).subscribe(response => {
      this.carDetail = response.data;
      this.dataLoaded = true;
    });
  }

  getCarsByLocationId(locationId: number) {
    this.carService.getCarsByLocationId(locationId).subscribe(response => {
      this.carDetail = response.data;
      this.dataLoaded = true;
    });
  }

  doesntrent(car: CarDetail) {
    this.toastrService.error("Şuan Başka Birisine Kiralı", car.description);
  }
}
