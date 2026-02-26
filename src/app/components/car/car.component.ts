import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { CarDetail } from 'src/app/models/carDetail';
import { Color } from 'src/app/models/color';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';
import { ColorService } from 'src/app/services/color.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { FilterPipePipe } from '../../pipes/filter-pipe.pipe';

@Component({
    selector: 'app-car',
    templateUrl: './car.component.html',
    styleUrls: ['./car.component.css'],
    imports: [FormsModule, NgFor, NgIf, RouterLink, CurrencyPipe, FilterPipePipe]
})
export class CarComponent implements OnInit {
  allCars: CarDetail[] = [];
  filteredCars: CarDetail[] = [];
  pagedCars: CarDetail[] = [];
  brands: Brand[] = [];
  colors: Color[] = [];
  cities: string[] = [];
  dataLoaded = false;
  filterText = "";
  selectedBrandId: number = 0;
  selectedColorId: number = 0;
  selectedCity: string = "";

  // Pagination
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;

  constructor(
    private carService: CarService,
    private brandService: BrandService,
    private colorService: ColorService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadBrands();
    this.loadColors();
    this.getCarDetails();
  }

  loadBrands() {
    this.brandService.getBrands().subscribe(response => {
      this.brands = response.data;
    });
  }

  loadColors() {
    this.colorService.getColors().subscribe(response => {
      this.colors = response.data;
    });
  }

  getCarDetails() {
    this.carService.getCarDetails().subscribe(response => {
      this.allCars = response.data;
      this.cities = [...new Set(this.allCars.map(c => c.locationCity).filter(Boolean))].sort();
      this.applyFilters();
      this.dataLoaded = true;
    });
  }

  onBrandChange(event: Event) {
    this.selectedBrandId = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 1;
    this.applyFilters();
  }

  onColorChange(event: Event) {
    this.selectedColorId = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 1;
    this.applyFilters();
  }

  onCityChange(event: Event) {
    this.selectedCity = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allCars];

    if (this.selectedBrandId) {
      filtered = filtered.filter(c => c.brandId === this.selectedBrandId);
    }

    if (this.selectedColorId) {
      filtered = filtered.filter(c => c.colorId === this.selectedColorId);
    }

    if (this.selectedCity) {
      filtered = filtered.filter(c => c.locationCity === this.selectedCity);
    }

    this.filteredCars = filtered;
    this.totalPages = Math.max(1, Math.ceil(this.filteredCars.length / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.updatePagedCars();
  }

  updatePagedCars() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedCars = this.filteredCars.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedCars();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  clearFilters() {
    this.selectedBrandId = 0;
    this.selectedColorId = 0;
    this.selectedCity = "";
    this.currentPage = 1;
    this.applyFilters();
  }

  get hasActiveFilter(): boolean {
    return this.selectedBrandId > 0 || this.selectedColorId > 0 || this.selectedCity !== '';
  }

  doesntrent(car: CarDetail) {
    this.toastrService.error("Şuan Başka Birisine Kiralı", car.description);
  }
}
