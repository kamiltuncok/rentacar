import { Component, OnInit } from '@angular/core';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  brands: Brand[] = [];
  currentBrand: Brand;
  emptyBrand: Brand;
  filterText = "";

  constructor(
    private brandService: BrandService,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands() {
    this.brandService.getBrands().subscribe(response => {
      this.brands = response.data;
    });
  }

  setCurrentBrand(brand: Brand) {
    this.currentBrand = brand;
  }

  clearCurrentBrand() {
    this.currentBrand = this.emptyBrand;
  }

  getCurrentBrandClass(brand: Brand) {
    return brand === this.currentBrand ? "list-group-item active" : "list-group-item";
  }

  getAllBrandClass() {
    return !this.currentBrand ? "list-group-item active" : "list-group-item";
  }
}
