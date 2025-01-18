import { Location } from './../../models/location';
import { LocationService } from 'src/app/services/location.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  locations: Location[] = [];
  selectedCity: string = '';

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.getLocations(); // İlk başta tüm lokasyonları listele
  }

  // Tüm lokasyonları getir
  getLocations(): void {
    this.locationService.getLocations().subscribe(response => {
      this.locations = response.data;
    });
  }

  // Şehir bazlı filtreleme yap
  getLocationsByCity(city: string): void {
    if (city) {
      this.locationService.getLocationsByCity(city).subscribe(response => {
        this.locations = response.data;
      });
    } else {
      this.getLocations(); // Eğer şehir seçimi yapılmazsa tüm lokasyonları getir
    }
  }

  // Şehir değiştiğinde çağrılacak metot
  onCityChange(event: any): void {
    const city = event.target.value;
    this.getLocationsByCity(city);
  }
}
