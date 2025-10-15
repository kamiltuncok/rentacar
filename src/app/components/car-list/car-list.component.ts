import { GearService } from './../../services/gear.service';
import { FuelService } from './../../services/fuel.service';
import { Fuel } from './../../models/fuel';
import { Gear } from './../../models/gear';
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
  gun: number;
  from: string = '';
  to: string = '';
  dataLoaded = false;
  apiUrl = "https://localhost:44306/Uploads/Images/";
  defaultImagePath = 'https://www.araba.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Ftasit-com%2Fimages%2Ff_webp%2Cq_auto%2Fv1694162148%2Fmg-araba-modelleri%2Fmg-araba-modelleri.webp%3F_i%3DAA&w=3840&q=75';
  customerType: number; // Customer type to distinguish between individual and corporate
    fuels: Fuel[] = [];
  gears: Gear[] = [];
  selectedFuelIds: number[] = [];
  selectedGearIds: number[] = [];

  constructor(
    private carDetailService: CarService,
    private carImageService: CarImageService,
    private activatedRoute: ActivatedRoute,
    private fuelService: FuelService,
    private gearService: GearService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
  this.activatedRoute.queryParams.subscribe(queryParams => {
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
    this.getCarByLocationName(this.locationName);
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

 isFuelSelected(fuelId: number): boolean {
    return this.selectedFuelIds.includes(fuelId);
  }

  // Gear checkbox durumunu kontrol et
  isGearSelected(gearId: number): boolean {
    return this.selectedGearIds.includes(gearId);
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
    // Hem fuel hem gear seçiliyse kombine filtreleme
    if (this.selectedFuelIds.length > 0 || this.selectedGearIds.length > 0) {
      this.getCarsByFilters(this.selectedFuelIds, this.selectedGearIds, this.locationName);
    } else {
      // Hiç filtre seçilmediyse tüm araçları getir
      this.getCarByLocationName(this.locationName);
    }
  }

  getCarsByFilters(fuelIds: number[], gearIds: number[], locationName: string) {
    this.dataLoaded = false;
    this.carDetailService.getCarsByFilters(fuelIds, gearIds, locationName).subscribe(response => {
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
      this.getCarImageByColorAndBrandId(car.brandId, car.colorId, car);
    }
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
  const routePath = this.customerType === 0 ? 'payment' : 'paymentcorporate';
  
  // Sadece gun state ile, diğerleri query param olarak
  this.router.navigate([routePath, carId], {
    relativeTo: this.activatedRoute,
    queryParams: {
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
