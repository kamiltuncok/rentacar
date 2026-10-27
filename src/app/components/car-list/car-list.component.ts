import { SegmentService } from './../../services/segment.service';
import { GearService } from './../../services/gear.service';
import { FuelService } from './../../services/fuel.service';
import { Fuel } from './../../models/fuel';
import { Gear } from './../../models/gear';
import { Segment } from './../../models/segment';
import { ToastrService } from 'ngx-toastr';
import { CarImageService } from './../../services/car-image.service';
import { CarImage } from './../../models/carImage';
import { CarDetail } from './../../models/carDetail';
import { CarService } from 'src/app/services/car.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css'],
  imports: [NgIf, NgFor, NgClass]
})
export class CarListComponent {
  carDetails: CarDetail[] = [];
  startLocationId: number;
  endLocationId: number;
  locationName: string;
  locationEndName: string;
  startTime: string = '';
  endTime: string = '';
  gun: number;
  from: string = '';
  to: string = '';
  dataLoaded = false;
  apiUrl = "https://localhost:44306/Uploads/Images/";
  defaultImagePath = 'assets/images/middle.png';
  customerType: number; // Customer type to distinguish between individual and corporate
  fuels: Fuel[] = [];
  gears: Gear[] = [];
  segments: Segment[] = [];
  selectedFuelIds: number[] = [];
  selectedGearIds: number[] = [];
  selectedSegmentIds: number[] = [];

  isSegmentFilterDisabled: boolean = false;

  constructor(
    private carDetailService: CarService,
    private carImageService: CarImageService,
    private activatedRoute: ActivatedRoute,
    private fuelService: FuelService,
    private gearService: GearService,
    private segmentService: SegmentService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.startLocationId = +queryParams["startLocationId"];
      this.endLocationId = +queryParams["endLocationId"];
      this.locationName = queryParams["locationName"];
      this.locationEndName = queryParams["locationEndName"];
      this.from = queryParams["from"];
      this.to = queryParams["to"];
      this.startTime = queryParams["startTime"];
      this.endTime = queryParams["endTime"];
      this.customerType = +queryParams["customerType"];

      // URL'den gelen tarihlere göre gun'ı hesapla
      this.calculateGunFromDates();
      this.getFuels();
      this.getGears();
      this.getSegments();

      // Explicit initial call with basic filters
      this.applyFilters();
    });
  }

  getFuels() {
    this.fuelService.getFuels().subscribe(response => {
      this.fuels = response.data;
    });
  }

  getGears() {
    this.gearService.getGears().subscribe(response => {
      this.gears = response.data;
    });
  }

  getSegments() {
    this.segmentService.getSegments().subscribe(response => {
      this.segments = response.data;

      // Segmentleri yükledikten sonra seçili segmenti kontrol et
      this.applySegmentFilter();
    });
  }

  applySegmentFilter() {
    const storedSegment = sessionStorage.getItem('selectedSegment');
    if (storedSegment && this.segments.length > 0) {
      const segment = this.segments.find(s => s.segmentName === storedSegment);
      if (segment) {
        // Sadece bu segmenti seç
        this.selectedSegmentIds = [segment.segmentId];
        this.isSegmentFilterDisabled = true;

        // Filtreleme yap
        this.applyFilters();

        // Temizle
        sessionStorage.removeItem('selectedSegment');
      }
    }
  }

  // Fix known data typo (Porche -> Porsche)
  private fixSpelling(text: string): string {
    return (text || '').replace(/porche/gi, 'Porsche');
  }

  // Card title as "Brand Model" without repeating the brand
  carTitle(car: CarDetail): string {
    const brand = this.fixSpelling(car.brandName).trim();
    const desc = this.fixSpelling(car.description).trim();
    if (!desc) return brand;
    if (brand && desc.toLowerCase().startsWith(brand.toLowerCase())) {
      return desc;
    }
    return (brand ? brand + ' ' : '') + desc;
  }

  isSegmentSelected(segmentId: number): boolean {
    return this.selectedSegmentIds.includes(segmentId);
  }

  // Fuel checkbox durumunu kontrol et
  isFuelSelected(fuelId: number): boolean {
    return this.selectedFuelIds.includes(fuelId);
  }

  // Gear checkbox durumunu kontrol et
  isGearSelected(gearId: number): boolean {
    return this.selectedGearIds.includes(gearId);
  }

  onSegmentCheckboxChange(event: any, segmentId: number) {
    if (event.target.checked) {
      this.selectedSegmentIds.push(segmentId);
    } else {
      this.selectedSegmentIds = this.selectedSegmentIds.filter(id => id !== segmentId);
    }
    this.applyFilters();
  }

  onFuelCheckboxChange(event: any, fuelId: number) {
    if (event.target.checked) {
      this.selectedFuelIds.push(fuelId);
    } else {
      this.selectedFuelIds = this.selectedFuelIds.filter(id => id !== fuelId);
    }
    this.applyFilters();
  }

  onGearCheckboxChange(event: any, gearId: number) {
    if (event.target.checked) {
      this.selectedGearIds.push(gearId);
    } else {
      this.selectedGearIds = this.selectedGearIds.filter(id => id !== gearId);
    }
    this.applyFilters();
  }

  applyFilters() {
    this.dataLoaded = false;

    // Use DomainV2 Availability Check DTO
    let filterDateStart = this.from;
    let filterDateEnd = this.to;

    // Combine dates with times for strict domain checks
    if (this.from && this.startTime) {
      filterDateStart = `${this.from}T${this.startTime}`;
    }
    if (this.to && this.endTime) {
      filterDateEnd = `${this.to}T${this.endTime}`;
    }

    const filter = {
      startLocationId: this.startLocationId,
      endLocationId: this.endLocationId,
      startDate: filterDateStart,
      endDate: filterDateEnd,
      fuelIds: this.selectedFuelIds,
      gearIds: this.selectedGearIds,
      segmentIds: this.selectedSegmentIds
    };


    this.carDetailService.getAvailableCars(filter).subscribe(response => {
      this.carDetails = response.data;
      this.dataLoaded = true;
      this.loadCarImages();
    });
  }

  calculateGunFromDates() {
    if (this.from && this.to) {
      const startDateTime = new Date(this.from + 'T' + this.startTime);
      const endDateTime = new Date(this.to + 'T' + this.endTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Geçmiş tarih kontrolü
      if (startDateTime < today) {
        this.toastrService.error('Teslim alma tarihi bugünden önce olamaz.', 'Hata');
        this.router.navigate(['/home']); // Ana sayfaya yönlendir
        return;
      }

      // Tarih sıralaması kontrolü
      if (startDateTime >= endDateTime) {
        this.toastrService.error('Alış tarihi, iade tarihinden önce olmalıdır.', 'Hata');
        this.router.navigate(['/home']);
        return;
      }

      const dayDifference = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24));
      this.gun = dayDifference;

      sessionStorage.setItem('gun', dayDifference.toString());
    } else {
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.gun = navigation.extras.state['gun'];
      } else {
        const storedGun = sessionStorage.getItem('gun');
        if (storedGun) {
          this.gun = parseInt(storedGun, 10);
        }
      }
    }
  }

  loadCarImages() {
    for (const car of this.carDetails) {
      this.getCarImagesByCarId(car.id, car);
    }
  }

  getCarImagesByCarId(carId: number, car: CarDetail) {
    this.carImageService.getCarImagesByCarId(carId).subscribe(response => {
      car.imagePath = response.data;
    });
  }

  getFallbackImage(car?: CarDetail): string {
    const text = ((car?.segmentName || '') + ' ' + (car?.description || '') + ' ' + (car?.brandName || '')).toLowerCase();
    if (text.includes('ekonom') || text.includes('economy') || text.includes('clio') || text.includes('egea') || text.includes('i20') || text.includes('polo')) {
      return 'assets/images/economy.png';
    }
    if (text.includes('lüks') || text.includes('luks') || text.includes('lux') || text.includes('premium') || text.includes('porsche') || text.includes('passat') || text.includes('bmw') || text.includes('mercedes') || text.includes('audi') || text.includes('tesla')) {
      return 'assets/images/lux.jpg';
    }
    return 'assets/images/middle.png';
  }

  getImagePath(car: CarDetail): string {
    if (car && car.imagePath && car.imagePath.length > 0) {
      const firstImage = car.imagePath[0];
      if (firstImage && firstImage.imagePath) {
        const path = firstImage.imagePath;
        if (path === 'default-car-image.jpg') {
          return this.getFallbackImage(car);
        }
        if (path.startsWith('http://') || path.startsWith('https://')) {
          return path;
        }
        return this.apiUrl + path;
      }
    }
    return this.getFallbackImage(car);
  }

  onImgError(event: Event, car?: CarDetail) {
    const img = event.target as HTMLImageElement;
    const fallback = this.getFallbackImage(car);
    if (img.src !== fallback && !img.src.endsWith(fallback)) {
      img.src = fallback;
    }
  }

  segmentClass(segmentName: string): string {
    const name = (segmentName || 'Ekonomik').toLowerCase();
    if (name.includes('lüks') || name.includes('luks') || name.includes('lux') || name.includes('üst') || name.includes('premium')) {
      return 'cl-badge--lux';
    }
    if (name.includes('orta') || name.includes('middle')) {
      return 'cl-badge--mid';
    }
    return 'cl-badge--eco';
  }

  navigateToPayment(carId: number) {
    // Sadece gun state ile, diğerleri query param olarak
    this.router.navigate(['/home/carlist/payment', carId], {
      queryParams: {
        startLocationId: this.startLocationId,
        endLocationId: this.endLocationId,
        locationName: this.locationName,
        locationEndName: this.locationEndName,
        from: this.from,
        to: this.to,
        startTime: this.startTime,
        endTime: this.endTime,
        customerType: this.customerType
      },
      state: {
        gun: this.gun
      }
    });
  }
}
