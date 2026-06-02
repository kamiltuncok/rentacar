import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { CarDetail } from 'src/app/models/carDetail';
import { Color } from 'src/app/models/color';
import { Segment } from 'src/app/models/segment';
import { Fuel } from 'src/app/models/fuel';
import { Gear } from 'src/app/models/gear';
import { CarImage } from 'src/app/models/carImage';
import { CarStatus } from 'src/app/models/car';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';
import { LocationService } from 'src/app/services/location.service';
import { SegmentService } from 'src/app/services/segment.service';
import { FuelService } from 'src/app/services/fuel.service';
import { GearService } from 'src/app/services/gear.service';
import { CarImageService } from 'src/app/services/car-image.service';
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
  CarStatus = CarStatus;
  allCars: CarDetail[] = [];
  filteredCars: CarDetail[] = [];
  pagedCars: CarDetail[] = [];
  brands: Brand[] = [];
  colors: Color[] = [];
  segments: Segment[] = [];
  fuels: Fuel[] = [];
  gears: Gear[] = [];
  dataLoaded = false;
  filterText = "";

  // Active filters state
  selectedBrandId: number = 0;
  selectedSegmentName: string = "";
  selectedFuelName: string = "";
  selectedGearName: string = "";
  minPrice: number = 0;
  maxPrice: number = 5000;
  priceLimit: number = 5000; // Upper limit of the slider
  availability: string = 'all'; // 'all' or 'available'

  apiUrl = "https://localhost:44306/Uploads/Images/";
  defaultImagePath = 'assets/images/lux.jpg';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6; // Compact view showing 6 premium cards per page
  totalPages: number = 1;

  constructor(
    private carService: CarService,
    private brandService: BrandService,
    private colorService: ColorService,
    private segmentService: SegmentService,
    private fuelService: FuelService,
    private gearService: GearService,
    private carImageService: CarImageService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadBrands();
    this.loadSegments();
    this.loadFuels();
    this.loadGears();
    this.activatedRoute.params.subscribe(params => {
      if (params['brandId']) {
        this.selectedBrandId = Number(params['brandId']);
      } else {
        this.selectedBrandId = 0;
      }
      this.getCarDetails();
    });
  }

  loadBrands() {
    this.brandService.getBrands().subscribe(response => {
      this.brands = response.data;
    });
  }

  loadSegments() {
    this.segmentService.getSegments().subscribe(response => {
      this.segments = response.data;
    });
  }

  loadFuels() {
    this.fuelService.getFuels().subscribe(response => {
      this.fuels = response.data;
    });
  }

  loadGears() {
    this.gearService.getGears().subscribe(response => {
      this.gears = response.data;
    });
  }

  getCarDetails() {
    this.carService.getCarDetails().subscribe(response => {
      this.allCars = response.data;
      
      // Determine initial price limits dynamically based on catalog values
      if (this.allCars.length > 0) {
        const prices = this.allCars.map(c => c.dailyPrice);
        this.minPrice = Math.min(...prices);
        this.maxPrice = Math.max(...prices);
        this.priceLimit = this.maxPrice;
      }
      
      this.loadCarImages();
      this.applyFilters();
      this.dataLoaded = true;
    });
  }

  loadCarImages() {
    for (const car of this.allCars) {
      this.getCarImagesByCarId(car.id, car);
    }
  }

  getCarImagesByCarId(carId: number, car: CarDetail) {
    this.carImageService.getCarImagesByCarId(carId).subscribe(response => {
      car.imagePath = response.data;
    });
  }

  getImagePath(car: CarDetail): string {
    if (car && car.imagePath && car.imagePath.length > 0) {
      const firstImage = car.imagePath[0];
      if (firstImage && firstImage.imagePath) {
        if (firstImage.imagePath.startsWith('http://') || firstImage.imagePath.startsWith('https://')) {
          return firstImage.imagePath;
        }
        return this.apiUrl + firstImage.imagePath;
      }
    }
    return this.defaultImagePath;
  }

  // Filter change handlers
  onBrandSelect(brandId: number) {
    this.selectedBrandId = brandId;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSegmentSelect(segmentName: string) {
    this.selectedSegmentName = segmentName;
    this.currentPage = 1;
    this.applyFilters();
  }

  onFuelSelect(fuelName: string) {
    this.selectedFuelName = fuelName;
    this.currentPage = 1;
    this.applyFilters();
  }

  onGearSelect(gearName: string) {
    this.selectedGearName = gearName;
    this.currentPage = 1;
    this.applyFilters();
  }

  onPriceChange(price: number) {
    this.maxPrice = price;
    this.currentPage = 1;
    this.applyFilters();
  }

  onAvailabilitySelect(status: string) {
    this.availability = status;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allCars];

    if (this.selectedBrandId) {
      filtered = filtered.filter(c => c.brandId === this.selectedBrandId);
    }

    if (this.selectedSegmentName) {
      filtered = filtered.filter(c => c.segmentName === this.selectedSegmentName);
    }

    if (this.selectedFuelName) {
      filtered = filtered.filter(c => c.fuelName === this.selectedFuelName);
    }

    if (this.selectedGearName) {
      filtered = filtered.filter(c => c.gearName === this.selectedGearName);
    }

    // Price range
    filtered = filtered.filter(c => c.dailyPrice <= this.maxPrice);

    // Availability
    if (this.availability === 'available') {
      filtered = filtered.filter(c => c.status === CarStatus.Available);
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
    this.selectedSegmentName = "";
    this.selectedFuelName = "";
    this.selectedGearName = "";
    this.maxPrice = this.priceLimit;
    this.availability = 'all';
    this.filterText = '';
    this.currentPage = 1;
    this.applyFilters();
    this.toastrService.info("Filtreler temizlendi.", "Bilgi");
  }

  get hasActiveFilter(): boolean {
    return this.selectedBrandId > 0 || 
           this.selectedSegmentName !== "" || 
           this.selectedFuelName !== "" || 
           this.selectedGearName !== "" || 
           this.maxPrice < this.priceLimit || 
           this.availability !== 'all' ||
           this.filterText !== '';
  }

  doesntrent(car: CarDetail) {
    this.toastrService.error("Bu araç şu anda başka bir müşterimize kiralıdır.", "Araç Dolu");
  }
}
