import { RentalDetail } from './../../models/rentalDetail';
import { Component, OnInit } from '@angular/core';
import { RentalService } from 'src/app/services/rental.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css'],
  imports: [NgIf, NgFor, RouterLink, CurrencyPipe]
})
export class RentalComponent implements OnInit {
  rentals: RentalDetail[] = [];
  isLoading: boolean = false;
  userId: number;

  defaultImageUrl: string = "https://localhost:44306/Uploads/Images/default-car-image.jpg";

  constructor(
    private rentalService: RentalService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getUserRentals();
  }

  getUserRentals() {
    this.isLoading = true;

    this.userId = this.authService.getCurrentUserId;
    if (!this.userId) {
      this.toastrService.error('Kullanıcı bilgileri alınamadı.', 'Hata');
      this.isLoading = false;
      return;
    }

    this.rentalService.getRentalDetailsByUserId(this.userId).subscribe(
      (response) => {
        if (response.success) {
          this.rentals = response.data;
          console.log('Kiralama bilgileri:', this.rentals);
        } else {
          this.toastrService.error(response.message, 'Hata');
        }
        this.isLoading = false;
      },
      (error) => {
        this.toastrService.error('Kiralama bilgileri yüklenirken bir hata oluştu.', 'Hata');
        this.isLoading = false;
        console.error('Error:', error);
      }
    );
  }

  // Resim yüklenmezse default resmi koy
  setDefaultImage(event: any) {
    event.target.src = this.defaultImageUrl;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR');
  }

  getStatusClass(status: number): string {
    if (status === 1) return 'badge-warning';
    if (status === 2) return 'badge-success';
    return 'badge-danger';
  }

  getStatusText(status: number): string {
    if (status === 1) return 'Aktif Kiralama';
    if (status === 2) return 'Tamamlandı';
    return 'İptal Edildi';
  }
}