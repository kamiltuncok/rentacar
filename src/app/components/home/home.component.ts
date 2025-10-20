import { CarService } from 'src/app/services/car.service';
import { Segment } from './../../models/segment';
import { SegmentService } from './../../services/segment.service';
import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from './../../models/location';
import { LocationService } from './../../services/location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  alisOfisiOptions: string[] = [];
  iadeOfisiOptions: string[] = [];
  customerType: string = 'individual';
  showCityPopup: boolean = false;
  showSegmentPopup: boolean = false;
  selectedCity: string = '';
  selectedSegment: string = '';
  cityLocations: string[] = [];
  segments: Segment[] = [];
  segmentPrices: { [key: number]: string } = {};

  constructor(
    private locationService: LocationService,
    private router: Router,
    private carService:CarService,
    private toastrService: ToastrService,
    private segmentService:SegmentService
  ) {}

  ngOnInit(): void {
    this.locationService.getLocations().subscribe((response) => {
      if (response.success) {
        this.alisOfisiOptions = response.data.map((location: Location) => location.locationName);
        this.iadeOfisiOptions = response.data.map((location: Location) => location.locationName);
      }
    });

    this.getSegments();
  }

   getSegments() {
    this.segmentService.getSegments().subscribe((response) => {
      if (response.success) {
        this.segments = response.data;
        // Her segment için fiyatları getir
        this.segments.forEach(segment => {
          this.getSegmentPrice(segment.segmentId);
        });
      }
    });
  }

  getSegmentPrice(segmentId: number): string {
    // Önce cache'ten kontrol et
    if (this.segmentPrices[segmentId]) {
      return this.segmentPrices[segmentId];
    }

    // API'den fiyatı getir
    this.carService.getLowestPriceBySegment(segmentId).subscribe((response) => {
      if (response.success && response.data > 0) {
        this.segmentPrices[segmentId] = response.data + ' TL';
      } else {
        this.segmentPrices[segmentId] = 'Fiyat bulunamadı';
      }
    });

    return 'Yükleniyor...'; // Default değer
  }

 navigateToCarList(searchData: any) {
  const locationName = this.alisOfisiOptions.find((loc) => loc === searchData.selectedStartLocation);
  const locationEndName = this.iadeOfisiOptions.find((loc) => loc === searchData.selectedEndLocation);

  if (locationName && locationEndName) {
    const startDateTime = new Date(searchData.selectedStartDate + 'T' + searchData.selectedStartTime);
    const endDateTime = new Date(searchData.selectedEndDate + 'T' + searchData.selectedEndTime);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDateTime < today) {
      this.toastrService.error('Teslim alma tarihi bugünden önce olamaz. Lütfen tarihi kontrol edin.', "Hata");
      return;
    }

    if (startDateTime >= endDateTime) {
      this.toastrService.error('Alış tarihi, iade tarihinden önce olmalıdır. Lütfen tarihi kontrol edin.',"Hata");
      return;
    }

    const dayDifference = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24));

    // gun'ı sessionStorage'a kaydet (sayfa yenileme durumu için)
    sessionStorage.setItem('gun', dayDifference.toString());

    sessionStorage.setItem('selectedSegment', this.selectedSegment);

    const queryParams = {
      locationName: locationName,
      locationEndName: locationEndName,
      from: searchData.selectedStartDate,
      to: searchData.selectedEndDate,
      startTime: searchData.selectedStartTime,
      endTime: searchData.selectedEndTime,
      customerType: searchData.customerType === 'individual' ? 0 : 1
    };

    this.router.navigate(['home/carlist'], { 
      queryParams: queryParams,
      state: { gun: dayDifference,
        segment: this.selectedSegment
       }
    });

    this.closeSegmentPopup();
  }
  else {
    this.toastrService.error('Lütfen teslim alma ve iade ofisini seçin.', 'Hata');
  }
}

  openCityPopup(city: string) {
  this.selectedCity = city;
  this.showCityPopup = true;

  this.locationService.getLocationsByCity(city).subscribe((response) => {
    if (response.success && response.data.length > 0) {
      this.cityLocations = response.data.map((loc: Location) => loc.locationName);
    } else {
      this.toastrService.error(`${city} için uygun lokasyon bulunamadı.`, 'Hata');
      this.cityLocations = []; // Boş array set et
    }
  });
}

openSegmentPopup(segment: string) {
  this.selectedSegment = segment;
  this.showSegmentPopup = true;
}

  closeCityPopup() {
    this.showCityPopup = false;
    this.selectedCity = '';
  }

  closeSegmentPopup() {
  this.showSegmentPopup = false;
  this.selectedSegment = '';
}
}