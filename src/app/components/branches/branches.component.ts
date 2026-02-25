import { Component, OnInit } from '@angular/core';
import { Location } from './../../models/location';
import { LocationService } from 'src/app/services/location.service';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  locations: Location[] = [];
  selectedCity: string = '';
  private map: any;
  private markers: L.Marker[] = [];
  highlightedLocation: string = '';

  constructor(
    private locationService: LocationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initMap();
    this.getLocations();

    // Query params'ı dinle
    this.route.queryParams.subscribe(params => {
      if (params['location']) {
        this.highlightedLocation = params['location'];
        this.highlightLocationOnMap();
      }
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView([39.9334, 32.8597], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(this.map);
  }

  private addLocationsToMap(): void {
    // Önceki marker'ları temizle
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // Özel marker ikonu
    const customIcon = L.icon({
      iconUrl: 'assets/images/location.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    // Vurgulanan lokasyon için farklı ikon
    const highlightedIcon = L.icon({
      iconUrl: 'assets/images/location-highlighted.png', // Vurgulanmış ikon
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50]
    });

    // Marker'ları ekle
    this.locations.forEach(location => {
      const isHighlighted = this.highlightedLocation === location.locationName;

      const marker = L.marker([location.latitude, location.longitude], {
        icon: isHighlighted ? highlightedIcon : customIcon
      })
        .addTo(this.map)
        .bindPopup(`
          <div style="min-width: 200px;">
            <strong>${location.locationName}</strong><br>
            <strong>Şehir:</strong> ${location.locationCity}<br>
            <strong>Adres:</strong> ${location.address}<br>
            <strong>Telefon:</strong> ${location.phoneNumber}<br>
            <strong>Email:</strong> ${location.email}
          </div>
        `);

      // Vurgulanan marker'ı aç
      if (isHighlighted) {
        marker.openPopup();
      }

      this.markers.push(marker);
    });

    // Haritayı marker'lara göre odakla
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private highlightLocationOnMap(): void {
    if (this.highlightedLocation && this.locations.length > 0) {
      // Marker'ları yeniden oluştur
      this.addLocationsToMap();
    }
  }

  getLocations(): void {
    this.locationService.getLocations().subscribe(response => {
      this.locations = response.data;
      this.addLocationsToMap();
    });
  }

  getLocationsByCity(city: string): void {
    if (city) {
      this.locationService.getLocationsByCity(city).subscribe(response => {
        this.locations = response.data;
        this.addLocationsToMap();
      });
    } else {
      this.getLocations();
    }
  }

  onCityChange(event: any): void {
    const city = event.target.value;
    this.selectedCity = city;
    this.getLocationsByCity(city);
  }

  filterByCity(city: string): void {
    this.selectedCity = city;
    this.getLocationsByCity(city);
  }
}