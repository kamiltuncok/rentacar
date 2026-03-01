import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-location-add',
  templateUrl: './location-add.component.html',
  styleUrls: ['./location-add.component.css'],
  imports: [FormsModule, NgIf, NgFor, RouterLink, DecimalPipe]
})
export class LocationAddComponent implements OnInit {

  location: Location = {
    id: 0,
    locationName: '',
    locationCityId: 0,
    address: '',
    email: '',
    phoneNumber: '',
    latitude: 0,
    longitude: 0
  };

  searchAddress: string = '';
  foundAddress: string = '';
  private map: any;
  private marker: any;
  selectedLocation: { lat: number, lng: number } | null = null;
  cities: { id: number, name: string }[] = [];

  // Şehir merkezleri (bazı tanınmış şehirler için harita kaydırma)
  private cityCenters: { [key: string]: [number, number] } = {
    'İstanbul': [41.0082, 28.9784],
    'Ankara': [39.9334, 32.8597],
    'İzmir': [38.4237, 27.1428]
  };

  constructor(
    private locationService: LocationService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initMap();
    this.loadCities();
  }

  loadCities(): void {
    this.locationService.getCities().subscribe(response => {
      if (response.success) {
        this.cities = response.data;
      }
    });
  }

  private initMap(): void {
    // Türkiye merkezinde harita oluştur
    this.map = L.map('locationMap').setView([39.9334, 32.8597], 6);

    // Tile layer ekle
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);

    // Haritaya tıklama event'i ekle
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onMapClick(e);
    });

    console.log('Harita oluşturuldu');
  }

  // Adres arama fonksiyonu
  async searchLocation(): Promise<void> {
    if (!this.searchAddress.trim()) {
      this.toastrService.warning('Lütfen bir adres girin');
      return;
    }

    this.toastrService.info('Adres aranıyor...');

    try {
      // OpenStreetMap Nominatim API kullanarak adres arama
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchAddress + ', Türkiye')}&limit=1`
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Koordinatları güncelle
        this.location.latitude = lat;
        this.location.longitude = lng;
        this.selectedLocation = { lat, lng };
        this.foundAddress = result.display_name;

        // Marker'ı güncelle
        this.updateMarker(lat, lng);

        // Haritayı bulunan konuma kaydır
        this.map.setView([lat, lng], 15);

        // Adres bilgisini location'a da yaz
        if (!this.location.address) {
          this.location.address = result.display_name;
        }

        this.toastrService.success('Adres bulundu!');
      } else {
        this.toastrService.error('Adres bulunamadı');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      this.toastrService.error('Adres aranırken hata oluştu');
    }
  }

  onMapClick(e: L.LeafletMouseEvent): void {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // Koordinatları güncelle
    this.location.latitude = parseFloat(lat.toFixed(6));
    this.location.longitude = parseFloat(lng.toFixed(6));
    this.selectedLocation = { lat, lng };
    this.foundAddress = 'Haritadan seçildi';

    // Marker'ı güncelle
    this.updateMarker(lat, lng);

    // Tıklanan konumun adresini al (reverse geocoding)
    this.reverseGeocode(lat, lng);

    this.toastrService.info(`Konum seçildi`);
  }

  // Reverse geocoding - koordinattan adres bulma
  async reverseGeocode(lat: number, lng: number): Promise<void> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=tr`
      );

      const data = await response.json();

      if (data && data.display_name) {
        this.foundAddress = data.display_name;

        // Adres bilgisini location'a da yaz (eğer boşsa)
        if (!this.location.address) {
          this.location.address = data.display_name;
        }

        // Şehir bilgisini de otomatik doldur - eşleşen bir ID bulmaya çalışırız
        if (!this.location.locationCityId && data.address && data.address.city) {
          const matchedCity = this.cities.find(c => c.name.toLowerCase() === data.address.city.toLowerCase());
          if (matchedCity) {
            this.location.locationCityId = matchedCity.id;
          }
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  }

  private updateMarker(lat: number, lng: number): void {
    // Eski marker'ı temizle
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Kendi PNG resmini ikon olarak tanımla
    const customIcon = L.icon({
      iconUrl: 'assets/images/location.png', // kendi resim yolun
      iconSize: [40, 40], // resmin boyutu
      iconAnchor: [20, 40], // ikonun haritada tam noktasını hizalamak için
      popupAnchor: [0, -40] // popup'ın ikonun üstünde görünmesi için
    });

    // Yeni marker'ı özel ikonla ekle
    this.marker = L.marker([lat, lng], { icon: customIcon })
      .addTo(this.map)
      .bindPopup(`
        <div>
          <strong>Seçilen Konum</strong><br>
          ${this.foundAddress || 'Adres belirleniyor...'}
        </div>
      `)
      .openPopup();

    // Harita merkezini seçilen konuma kaydır
    this.map.setView([lat, lng], 15);
  }

  onCityChange(): void {
    const selectedCityObj = this.cities.find(c => c.id == this.location.locationCityId);
    if (selectedCityObj && this.cityCenters[selectedCityObj.name]) {
      const center = this.cityCenters[selectedCityObj.name];
      this.map.setView(center, 10);

      // Şehir değişince koordinatları sıfırla
      this.location.latitude = 0;
      this.location.longitude = 0;
      this.selectedLocation = null;
      this.foundAddress = '';

      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
    }
  }

  onCoordinatesChange(): void {
    // ✅ VIRGÜLÜ NOKTAYA ÇEVİR
    this.convertCommaToDot();

    if (this.location.latitude && this.location.longitude) {
      this.selectedLocation = {
        lat: this.location.latitude,
        lng: this.location.longitude
      };
      this.foundAddress = 'Manuel girildi';
      this.updateMarker(this.location.latitude, this.location.longitude);
    }
  }

  // ✅ VIRGÜLÜ NOKTAYA ÇEVİREN METOT
  private convertCommaToDot(): void {
    console.log('🔧 convertCommaToDot çalıştı');

    // Latitude kontrolü
    if (typeof this.location.latitude === 'string') {
      const originalLat = this.location.latitude;
      this.location.latitude = parseFloat((this.location.latitude as string).replace(',', '.'));
      console.log('📍 Latitude converted:', originalLat, '→', this.location.latitude);
    } else if (typeof this.location.latitude === 'number') {
      console.log('📍 Latitude zaten number:', this.location.latitude);
    }

    // Longitude kontrolü
    if (typeof this.location.longitude === 'string') {
      const originalLng = this.location.longitude;
      this.location.longitude = parseFloat((this.location.longitude as string).replace(',', '.'));
      console.log('📍 Longitude converted:', originalLng, '→', this.location.longitude);
    } else if (typeof this.location.longitude === 'number') {
      console.log('📍 Longitude zaten number:', this.location.longitude);
    }
  }

  addLocation() {
    // ✅ VIRGÜLÜ NOKTAYA ÇEVİR (EK GÜVENLİK)
    this.convertCommaToDot();

    // ✅ DEBUG: Değerleri kontrol et
    console.log('🎯 FINAL VALUES - addLocation():');
    console.log('Latitude:', this.location.latitude, 'Type:', typeof this.location.latitude);
    console.log('Longitude:', this.location.longitude, 'Type:', typeof this.location.longitude);

    if (this.isFormValid()) {
      this.locationService.add(this.location).subscribe(
        (response) => {
          if (response.success) {
            this.toastrService.success('Şube başarıyla eklendi');
            this.router.navigate(['/branches']);
          } else {
            this.toastrService.error(response.message);
          }
        },
        (error) => {
          this.toastrService.error('Şube eklenirken bir hata oluştu');
          console.error('Hata detayı:', error);
        }
      );
    }
  }

  private isFormValid(): boolean {
    if (!this.location.locationName.trim()) {
      this.toastrService.warning('Şube adı boş olamaz');
      return false;
    }
    if (!this.location.locationCityId || this.location.locationCityId === 0) {
      this.toastrService.warning('Şehir seçmelisiniz');
      return false;
    }
    if (!this.location.address.trim()) {
      this.toastrService.warning('Adres boş olamaz');
      return false;
    }
    if (!this.location.email.trim()) {
      this.toastrService.warning('Email boş olamaz');
      return false;
    }
    if (!this.location.phoneNumber.trim()) {
      this.toastrService.warning('Telefon numarası boş olamaz');
      return false;
    }
    if (!this.selectedLocation) {
      this.toastrService.warning('Lütfen haritadan bir konum seçin');
      return false;
    }

    // ✅ EK KONTROL: Koordinatlar number mı?
    if (typeof this.location.latitude !== 'number' || typeof this.location.longitude !== 'number') {
      this.toastrService.warning('Koordinatlar geçerli sayılar olmalıdır');
      return false;
    }

    return true;
  }
}