import { RentalDetail } from './../../models/rentalDetail';
import { Component, OnInit } from '@angular/core';
import { RentalService } from 'src/app/services/rental.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerType } from 'src/app/models/rental';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  rentals: RentalDetail[] = [];
  isLoading: boolean = false;
  userId: number;
  customerType: string;
  defaultImageUrl: string = "https://localhost:44306/Uploads/Images/default-car-image.jpg";

  constructor(
    private rentalService: RentalService,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUserRentals();
  }

  getUserRentals() {
    this.isLoading = true;
    
    this.userId = this.authService.getCurrentUserId;
    this.customerType = this.authService.getCustomerType();

    console.log('User ID:', this.userId);
    console.log('Customer Type:', this.customerType);

    if (!this.userId || !this.customerType) {
      this.toastrService.error('Kullanıcı bilgileri alınamadı.', 'Hata');
      this.isLoading = false;
      return;
    }

    const customerTypeNumber = this.customerType === 'Corporate' ? CustomerType.Corporate : CustomerType.Individual;

    this.rentalService.getRentalDetailsByUserId(this.userId, customerTypeNumber).subscribe(
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

  getStatusClass(isReturned: boolean): string {
    return isReturned ? 'badge-success' : 'badge-warning';
  }

  getStatusText(isReturned: boolean): string {
    return isReturned ? 'Teslim Edildi' : 'Aktif Kiralama';
  }
}