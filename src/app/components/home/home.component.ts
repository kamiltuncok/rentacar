import { CarService } from 'src/app/services/car.service';
import { Segment } from './../../models/segment';
import { SegmentService } from './../../services/segment.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location, LocationCity } from './../../models/location';
import { LocationService } from './../../services/location.service';
import { CarSearchFormComponent } from '../car-search-form/car-search-form.component';
import { NgFor, NgIf } from '@angular/common';
import { switchMap, EMPTY, catchError } from 'rxjs';

interface CarSearchData {
  selectedStartLocation: string;
  selectedEndLocation: string;
  selectedStartDate: string;
  selectedEndDate: string;
  selectedStartTime: string;
  selectedEndTime: string;
  customerType: 'individual' | 'corporate';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CarSearchFormComponent, NgFor, NgIf]
})
export class HomeComponent {
  alisOfisiOptions: Location[] = [];
  iadeOfisiOptions: Location[] = [];
  customerType: string = 'individual';
  showCityPopup: boolean = false;
  showSegmentPopup: boolean = false;
  selectedCity: string = '';
  selectedSegment: string = '';
  cityLocations: Location[] = [];
  segments: Segment[] = [];
  segmentPrices: { [key: number]: string } = {};

  // ─── OtoGez landing content ───
  trustItems: string[] = ['Ücretsiz iptal', 'Gizli ücret yok', '7/24 yol yardımı', 'Anında onay'];

  reviews = [
    { name: 'Mert Y.', stars: '★★★★★', quote: 'Teslim alma çok hızlıydı, araç tertemizdi. Fiyatlar da gayet makuldü.' },
    { name: 'Aslı K.', stars: '★★★★★', quote: 'Farklı ofiste teslim seçeneği işimi çok kolaylaştırdı, tekrar tercih edeceğim.' },
    { name: 'Burak T.', stars: '★★★★☆', quote: 'Rezervasyon süreci sorunsuzdu, müşteri hizmetleri de ilgiliydi.' }
  ];

  faqs = [
    { q: 'Araç kiralamak için minimum ehliyet yaşı nedir?', a: 'Araç kiralayabilmek için en az 21 yaşında olmanız ve en az 2 yıllık ehliyete sahip olmanız gerekmektedir. Bazı lüks araç sınıflarında yaş sınırı 25 olabilir.' },
    { q: 'Depozito ne kadar ve nasıl alınır?', a: 'Depozito, araç sınıfına göre 3.000 TL ile 10.000 TL arasında değişir ve kredi kartından bloke olarak alınır. Aracı hasarsız teslim ettiğinizde blokaj kaldırılır.' },
    { q: 'Rezervasyonumu ücretsiz iptal edebilir miyim?', a: 'Alış tarihinden 48 saat öncesine kadar yapılan iptallerde herhangi bir ücret alınmaz ve ödemeniz tam olarak iade edilir.' },
    { q: 'Ek sürücü ekleyebilir miyim?', a: 'Evet, rezervasyon sırasında veya ofiste ek sürücü tanımlayabilirsiniz. Ek sürücünün de ehliyet şartlarını sağlaması gerekir.' },
    { q: 'Kilometre sınırı var mı?', a: 'Standart kiralamalarda günlük 300 km sınırı uygulanır. Sınırsız kilometre paketini kiralama sırasında ekstra ücretle seçebilirsiniz.' }
  ];
  faqOpen: { [key: number]: boolean } = {};

  constructor(
    private locationService: LocationService,
    private router: Router,
    private carService: CarService,
    private toastrService: ToastrService,
    private segmentService: SegmentService
  ) { }

  ngOnInit(): void {
    this.locationService.getLocations().subscribe((response) => {
      if (response.success) {
        this.alisOfisiOptions = response.data;
        this.iadeOfisiOptions = response.data;
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

  navigateToCarList(searchData: CarSearchData) {
    const startLocation = this.alisOfisiOptions.find((loc) => loc.locationName === searchData.selectedStartLocation);
    const endLocation = this.iadeOfisiOptions.find((loc) => loc.locationName === searchData.selectedEndLocation);

    if (startLocation && endLocation) {
      const startDateTime = new Date(searchData.selectedStartDate + 'T' + searchData.selectedStartTime);
      const endDateTime = new Date(searchData.selectedEndDate + 'T' + searchData.selectedEndTime);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDateTime < today) {
        this.toastrService.error('Teslim alma tarihi bugünden önce olamaz. Lütfen tarihi kontrol edin.', "Hata");
        return;
      }

      if (startDateTime >= endDateTime) {
        this.toastrService.error('Alış tarihi, iade tarihinden önce olmalıdır. Lütfen tarihi kontrol edin.', "Hata");
        return;
      }

      const dayDifference = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24));

      // gun'ı sessionStorage'a kaydet (sayfa yenileme durumu için)
      sessionStorage.setItem('gun', dayDifference.toString());

      sessionStorage.setItem('selectedSegment', this.selectedSegment);

      const queryParams = {
        startLocationId: startLocation.id,
        endLocationId: endLocation.id,
        locationName: startLocation.locationName,
        locationEndName: endLocation.locationName,
        from: searchData.selectedStartDate,
        to: searchData.selectedEndDate,
        startTime: searchData.selectedStartTime,
        endTime: searchData.selectedEndTime,
        customerType: searchData.customerType === 'individual' ? 0 : 1
      };

      this.router.navigate(['home/carlist'], {
        queryParams: queryParams,
        state: {
          gun: dayDifference,
          segment: this.selectedSegment
        }
      });

      this.closeSegmentPopup();
    }
    else {
      this.toastrService.error('Lütfen teslim alma ve iade ofisini seçin.', 'Hata');
    }
  }

  // Frontend HTML'den string 'Istanbul' geliyorsa onu ID'ye çevirmek için
  openCityPopup(cityName: string): void {
    this.selectedCity = cityName;
    this.showCityPopup = true;
    this.cityLocations = [];

    this.locationService.getCities().pipe(
      switchMap(cityRes => {
        if (!cityRes.success) return EMPTY;
        const found = cityRes.data.find((c: LocationCity) => c.name.toLowerCase() === cityName.toLowerCase());
        if (!found) return EMPTY;
        return this.locationService.getLocationsByCity(found.id);
      }),
      catchError(() => {
        this.toastrService.error(`${cityName} için lokasyon yüklenemedi.`, 'Hata');
        return EMPTY;
      })
    ).subscribe(response => {
      if (response.success && response.data.length > 0) {
        this.cityLocations = response.data;
      } else {
        this.toastrService.error(`${cityName} için uygun lokasyon bulunamadı.`, 'Hata');
        this.cityLocations = [];
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

  toggleFaq(index: number) {
    this.faqOpen[index] = !this.faqOpen[index];
  }

  // ─── Segment presentation helpers (OtoGez vehicle-class cards) ───
  getSegmentImage(segmentName: string): string {
    const name = (segmentName || '').toLowerCase();
    if (name.includes('ekonom') || name.includes('economy')) return 'assets/images/economy.png';
    if (name.includes('lüks') || name.includes('luks') || name.includes('lux') || name.includes('premium')) return 'assets/images/lux.jpg';
    if (name.includes('orta') || name.includes('middle') || name.includes('sedan')) return 'assets/images/middle.png';
    return 'assets/images/middle.png';
  }

  getSegmentFeatures(segmentName: string): string[] {
    const name = (segmentName || '').toLowerCase();
    if (name.includes('ekonom') || name.includes('economy')) return ['Manuel', '5 Koltuk', 'Klima'];
    if (name.includes('lüks') || name.includes('luks') || name.includes('lux') || name.includes('premium')) return ['Otomatik', '5 Koltuk', 'Klima + Deri'];
    return ['Otomatik', '5 Koltuk', 'Klima'];
  }
}