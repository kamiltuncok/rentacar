import { Component, OnInit } from '@angular/core';
import { RentalDetail } from 'src/app/models/rentalDetail';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { CustomerService } from 'src/app/services/customer.service';
import { IndividualCustomerService } from 'src/app/services/individual-customer.service';
import { CorporateCustomerService } from 'src/app/services/corporate-customer.service';
import { User } from 'src/app/models/user';
import { Customer } from 'src/app/models/customer';
import { CorporateCustomer } from 'src/app/models/corporateCustomer';
import { RentalService } from 'src/app/services/rental.service';
import { LocationManagerService } from 'src/app/services/location-manager.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-location-manager-rentals',
  templateUrl: './location-manager-rentals.component.html',
  styleUrls: ['./location-manager-rentals.component.css'],
  imports: [FormsModule, NgIf, NgFor, RouterLink, CurrencyPipe, DatePipe]
})
export class LocationManagerRentalsComponent implements OnInit {
  rentals: RentalDetail[] = [];
  filteredRentals: RentalDetail[] = [];
  userDetails: { [key: string]: any } = {};
  isLoading: boolean = false;
  isFiltering: boolean = false;
  userId: number;
  managedLocationNames: string[] = [];
  defaultImageUrl: string = "https://localhost:44306/Uploads/Images/default-car-image.jpg";

  filterDate: string = '';
  filterDateEnd: string = '';
  dateRangeMode: boolean = false;
  filterEmail: string = '';
  filterName: string = '';

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private userService: UserService,
    private customerService: CustomerService,
    private individualCustomerService: IndividualCustomerService,
    private corporateCustomerService: CorporateCustomerService,
    private rentalService: RentalService,
    private locationManagerService: LocationManagerService
  ) { }

  ngOnInit(): void {
    this.getManagedLocationRentals();
  }

  getManagedLocationRentals() {
    this.isLoading = true;

    this.userId = this.authService.getCurrentUserId;

    if (!this.userId) {
      this.toastrService.error('Kullanıcı bilgileri alınamadı.', 'Hata');
      this.isLoading = false;
      return;
    }

    if (!this.authService.isLocationManager()) {
      this.toastrService.error('Bu sayfayı görüntülemek için lokasyon yöneticisi olmalısınız.', 'Yetki Hatası');
      this.isLoading = false;
      return;
    }

    // Load user's managed locations first
    this.locationManagerService.getLocationManagers().subscribe(managerRes => {
      if (managerRes.success) {
        this.managedLocationNames = managerRes.data
          .filter(m => m.userId == this.userId)
          .map(m => m.locationName);
      }

      this.rentalService.getRentalsByManagerLocation(this.userId).subscribe(
        (response) => {
          if (response.success) {
            this.rentals = response.data;
            this.filteredRentals = [...this.rentals];
            this.loadUserDetails();
          } else {
            this.toastrService.error(response.message, 'Hata');
            this.isLoading = false;
          }
        },
        (error) => {
          this.toastrService.error('Kiralama bilgileri yüklenirken bir hata oluştu.', 'Hata');
          this.isLoading = false;
        }
      );
    });
  }

  applyFilters() {
    const hasDate = !!this.filterDate;
    const hasEmail = !!(this.filterEmail && this.filterEmail.trim());
    const hasName = !!(this.filterName && this.filterName.trim());

    if (!hasDate && !hasEmail && !hasName) {
      this.toastrService.warning('Lütfen en az bir filtre giriniz.', 'Uyarı');
      return;
    }

    if (hasDate && this.dateRangeMode && !this.filterDateEnd) {
      this.toastrService.warning('Lütfen bitiş tarihini de giriniz.', 'Uyarı');
      return;
    }

    this.isFiltering = true;

    this.filteredRentals = this.rentals.filter(r => {
      // 1. Date Filter
      if (hasDate) {
        const d = new Date(r.startDate);
        const rDate = d.getFullYear() + '-' +
          String(d.getMonth() + 1).padStart(2, '0') + '-' +
          String(d.getDate()).padStart(2, '0');

        if (this.dateRangeMode && this.filterDateEnd) {
          if (rDate < this.filterDate || rDate > this.filterDateEnd) return false;
        } else {
          if (rDate !== this.filterDate) return false;
        }
      }

      // 2. Name / Email Filter (Local Search in details)
      if (hasName || hasEmail) {
        const info = this.getUserInfo(r);
        if (!info) return false;

        if (hasName && !info.name?.toLowerCase().includes(this.filterName.toLowerCase())) return false;
        if (hasEmail && !info.email?.toLowerCase().includes(this.filterEmail.toLowerCase())) return false;
      }

      return true;
    });

    if (this.filteredRentals.length === 0) {
      this.toastrService.info('Filtre kriterlerine uygun kiralama bulunamadı.', 'Bilgi');
    } else {
      this.toastrService.success(`${this.filteredRentals.length} kiralama bulundu.`, 'Başarılı');
    }
    this.isFiltering = false;
  }

  clearFilter() {
    this.filterDate = '';
    this.filterDateEnd = '';
    this.filterEmail = '';
    this.filterName = '';
    this.filteredRentals = [...this.rentals];
    this.toastrService.info('Filtre temizlendi.', 'Bilgi');
  }

  loadUserDetails() {
    const promises = this.rentals.map((rental) => {
      // Unauthenticated Guest Users only have a customerId (userId is 0 or null)
      if (rental.customerId !== 0) {
        const key = `customer_${rental.customerId}`;
        if (!this.userDetails[key]) {
          // Fallback init
          this.userDetails[key] = { type: 'Unknown', data: null };

          return this.customerService.getCustomerDetailById(rental.customerId).toPromise()
            .then((result: any) => {
              if (result && result.success) {
                // If the customer has a company name, it's corporate
                if (result.data.companyName) {
                  this.userDetails[key] = {
                    type: 'CorporateCustomer',
                    data: result.data
                  };
                }
                // Else it's individual
                else {
                  this.userDetails[key] = {
                    type: 'IndividualCustomer',
                    data: result.data
                  };
                }
              }
            }).catch(e => console.error("Customer fetch error:", e));
        }
      }

      return Promise.resolve();
    });

    Promise.all(promises).then(() => {
      this.isLoading = false;
    }).catch(error => {
      this.isLoading = false;
    });
  }

  getUserInfo(rental: RentalDetail): any {
    const key = `customer_${rental.customerId}`;
    if (!key) return null;

    const userInfo = this.userDetails[key];
    if (!userInfo) return null;

    switch (userInfo.type) {
      case 'IndividualCustomer':
        const individualCustomer = userInfo.data as any; // Usually IndividualCustomer model
        return {
          type: 'Individual',
          source: 'Customer',
          name: `${individualCustomer.firstName || individualCustomer.email} ${individualCustomer.lastName || ''}`,
          email: individualCustomer.email,
          phone: individualCustomer.phoneNumber,
          identityNumber: individualCustomer.identityNumber || ''
        };

      case 'CorporateCustomer':
        const corporateCustomer = userInfo.data as any;
        return {
          type: 'Corporate',
          source: 'Customer',
          name: corporateCustomer.companyName,
          email: corporateCustomer.email,
          phone: corporateCustomer.phoneNumber,
          taxNumber: corporateCustomer.taxNumber
        };

      default:
        return null;
    }
  }

  setDefaultImage(event: any) {
    event.target.src = this.defaultImageUrl;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('tr-TR');
  }

  getStatusClass(status: number): string {
    return status === 2 ? 'badge-success' : status === 3 ? 'badge-danger' : 'badge-warning';
  }

  getStatusText(status: number): string {
    return status === 2 ? 'Teslim Edildi' : status === 3 ? 'İptal Edildi' : 'Aktif Kiralama';
  }

  canCollectDeposit(rental: RentalDetail): boolean {
    return rental.status === 1 && rental.depositStatus === 1 && this.managedLocationNames.includes(rental.startLocationName);
  }

  canDeliverVehicle(rental: RentalDetail): boolean {
    return rental.status === 1 && this.managedLocationNames.includes(rental.endLocationName);
  }

  canCancelRental(rental: RentalDetail): boolean {
    return rental.status === 1 && (this.managedLocationNames.includes(rental.startLocationName) || this.managedLocationNames.includes(rental.endLocationName));
  }

  collectDeposit(rental: RentalDetail) {
    if (!confirm(`#${rental.id} numaralı kiralama için depozitoyu tahsil etmek istiyor musunuz?`)) return;
    this.rentalService.collectDeposit(rental.id).subscribe(
      res => {
        if (res.success) {
          this.toastrService.success(res.message, 'Başarılı');
          rental.depositStatus = 2; // Charged
        } else {
          this.toastrService.error(res.message, 'Hata');
        }
      },
      err => this.toastrService.error('Sunucu hatası.', 'Hata')
    );
  }

  deliverVehicle(rental: RentalDetail) {
    if (!confirm(`#${rental.id} numaralı kiralama için aracı Teslim Edildi olarak işaretlemek istiyor musunuz?`)) return;
    this.rentalService.deliverVehicle(rental.id).subscribe(
      res => {
        if (res.success) {
          this.toastrService.success(res.message, 'Başarılı');
          rental.status = 2; // Completed
          rental.depositStatus = 3; // Refunded
        } else {
          this.toastrService.error(res.message, 'Hata');
        }
      },
      err => this.toastrService.error('Sunucu hatası.', 'Hata')
    );
  }

  cancelRental(rental: RentalDetail) {
    if (!confirm(`#${rental.id} numaralı kiralamayı iptal etmek istiyor musunuz?`)) return;
    this.rentalService.cancelRental(rental.id).subscribe(
      res => {
        if (res.success) {
          this.toastrService.success(res.message, 'Başarılı');
          rental.status = 3; // Cancelled
          rental.depositStatus = 3; // Refunded
        } else {
          this.toastrService.error(res.message, 'Hata');
        }
      },
      err => this.toastrService.error('Sunucu hatası.', 'Hata')
    );
  }
}