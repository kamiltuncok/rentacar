import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-brand',
    templateUrl: './brand.component.html',
    styleUrls: ['./brand.component.css'],
    imports: [FormsModule, NgFor]
})
export class BrandComponent implements OnInit {
  brands: Brand[] = [];
  currentBrand: Brand;
  emptyBrand: Brand;
  filterText = "";

  constructor(
    private brandService: BrandService,
    private carService: CarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getBrands();
  }

  getBrands() {
    this.brandService.getBrands().subscribe(response => {
      this.brands = response.data;
    });
  }

  onBrandChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.router.navigate(['/cars/brand', value]);
    } else {
      this.router.navigate(['/cars']);
    }
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
