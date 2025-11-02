import { RentalDetail } from './../../models/rentalDetail';
import { Component, OnInit } from '@angular/core';
import { RentalService } from 'src/app/services/rental.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  rentals: RentalDetail[] = [];
  loading: boolean = true;

  constructor(
    private rentalService: RentalService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadRentals();
  }

  loadRentals(): void {
    this.loading = true;
    
    // Şu anlık tüm kiralamaları getir, sonra user'a göre filtreleyeceğiz
    this.rentalService.getRentalDetails().subscribe(
      (response) => {
        this.rentals = response.data;
        this.loading = false;
        console.log('Kiralamalar:', this.rentals);
      },
      (error) => {
        this.toastrService.error('Kiralamalar yüklenirken hata oluştu');
        this.loading = false;
        console.error('Hata:', error);
      }
    );
  }

  getCustomerTypeText(customerType: number): string {
    switch(customerType) {
      case 0: return 'Bireysel';
      case 1: return 'Kurumsal';
      case 2: return 'Admin';
      default: return 'Bilinmeyen';
    }
  }
}