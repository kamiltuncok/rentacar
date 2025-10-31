import { Component, OnInit } from '@angular/core';
import { Location } from './../../models/location';
import { LocationService } from 'src/app/services/location.service';
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

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.initMap();
    this.getLocations();
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

    // Özel marker ikonu (senin PNG dosyan)
    const customIcon = L.icon({
      iconUrl: 'assets/images/location.png', // kendi ikonun
      iconSize: [40, 40], // boyut (isteğe göre değiştir)
      iconAnchor: [20, 40], // alt orta noktadan sabitle
      popupAnchor: [0, -40] // popup’ın konumunu ayarla
    });

    // Marker’ları ekle
    this.locations.forEach(location => {
      const marker = L.marker([location.latitude, location.longitude], { icon: customIcon })
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

      this.markers.push(marker);
    });

    // Haritayı marker'lara göre odakla
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
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
    this.getLocationsByCity(city);
  }
}
