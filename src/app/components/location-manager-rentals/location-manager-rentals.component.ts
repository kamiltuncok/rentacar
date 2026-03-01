import { Component, OnInit } from '@angular/core';
import { RentalDetail } from 'src/app/models/rentalDetail';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { CorporateUserService } from 'src/app/services/corporate-user.service';
import { CustomerService } from 'src/app/services/customer.service';
import { IndividualCustomerService } from 'src/app/services/individual-customer.service';
import { CorporateCustomerService } from 'src/app/services/corporate-customer.service';
import { User } from 'src/app/models/user';
import { CorporateUser } from 'src/app/models/corporateUser';
import { Customer } from 'src/app/models/customer';
import { CorporateCustomer } from 'src/app/models/corporateCustomer';
import { RentalService } from 'src/app/services/rental.service';
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
    private corporateUserService: CorporateUserService,
    private customerService: CustomerService,
    private individualCustomerService: IndividualCustomerService,
    private corporateCustomerService: CorporateCustomerService,
    private rentalService: RentalService
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
  }

  applyFilters() {
    const hasDate = !!this.filterDate;
    const hasEmail = !!(this.filterEmail && this.filterEmail.trim());
    const hasName = !!(this.filterName && this.filterName.trim());

    if (!hasDate && !hasEmail && !hasName) {
      this.toastrService.warning('Lütfen en az bir filtre giriniz.', 'Uyarı');
      return;
    }

    // Aralık modunda bitiş tarihi zorunlu
    if (hasDate && this.dateRangeMode && !this.filterDateEnd) {
      this.toastrService.warning('Lütfen bitiş tarihini de giriniz.', 'Uyarı');
      return;
    }

    // Aralık modunda başlangıç > bitiş kontrolü
    if (hasDate && this.dateRangeMode && this.filterDateEnd && this.filterDate > this.filterDateEnd) {
      this.toastrService.warning('Başlangıç tarihi bitiş tarihinden büyük olamaz.', 'Uyarı');
      return;
    }

    this.isFiltering = true;

    // Tarih filtresi: tek tarih veya aralık
    let dateObs: Observable<Set<number>>;
    if (!hasDate) {
      dateObs = of(null);
    } else if (this.dateRangeMode && this.filterDateEnd) {
      dateObs = this.rentalService.getRentalsByDateRange(this.filterDate, this.filterDateEnd).pipe(
        map(r => new Set<number>(r.success ? r.data.map((x: any) => x.rentalId) : []))
      );
    } else {
      // Tek tarih: aynı günü aralık olarak gönder
      dateObs = this.rentalService.getRentalsByDateRange(this.filterDate, this.filterDate).pipe(
        map(r => new Set<number>(r.success ? r.data.map((x: any) => x.rentalId) : []))
      );
    }

    const emailObs: Observable<Set<number>> = hasEmail
      ? this.rentalService.getRentalsByEmail(this.filterEmail.trim()).pipe(
        map(r => new Set<number>(r.success ? r.data.map((x: any) => x.rentalId) : []))
      )
      : of(null);

    const nameObs: Observable<Set<number>> = hasName
      ? this.rentalService.getRentalsByName(this.filterName.trim()).pipe(
        map(r => new Set<number>(r.success ? r.data.map((x: any) => x.rentalId) : []))
      )
      : of(null);

    forkJoin([dateObs, emailObs, nameObs]).subscribe(
      ([dateIds, emailIds, nameIds]) => {
        // Sadece aktif filtrelerin sonuçlarını kesişime al
        this.filteredRentals = this.rentals.filter(r => {
          if (dateIds !== null && !dateIds.has(r.id)) return false;
          if (emailIds !== null && !emailIds.has(r.id)) return false;
          if (nameIds !== null && !nameIds.has(r.id)) return false;
          return true;
        });

        if (this.filteredRentals.length === 0) {
          this.toastrService.info('Filtre kriterlerine uygun kiralama bulunamadı.', 'Bilgi');
        } else {
          this.toastrService.success(`${this.filteredRentals.length} kiralama bulundu.`, 'Başarılı');
        }
        this.isFiltering = false;
      },
      (error) => {
        this.toastrService.error('Filtreleme sırasında bir hata oluştu.', 'Hata');
        this.isFiltering = false;
      }
    );
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

          return this.customerService.getCustomerById(rental.customerId).toPromise()
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
      case 'IndividualUser':
        const individualUser = userInfo.data as User;
        return {
          type: 'Individual',
          source: 'User',
          name: `${individualUser.firstName} ${individualUser.lastName}`,
          email: individualUser.email,
          phone: individualUser.phoneNumber,
          identityNumber: individualUser.identityNumber
        };

      case 'CorporateUser':
        const corporateUser = userInfo.data as CorporateUser;
        return {
          type: 'Corporate',
          source: 'User',
          name: corporateUser.companyName,
          email: corporateUser.email,
          phone: corporateUser.phoneNumber,
          taxNumber: corporateUser.taxNumber
        };

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
    return status === 2 ? 'badge-success' : 'badge-warning';
  }

  getStatusText(status: number): string {
    return status === 2 ? 'Teslim Edildi' : 'Aktif Kiralama';
  }



  confirmReturn(rental: RentalDetail) {
    if (rental.status === 2) {
      this.toastrService.info('Bu kiralama zaten teslim edildi.', 'Bilgi');
      return;
    }
    const confirmed = confirm(`#${rental.id} numaralı kiralama teslim alındı olarak işaretlensin mi?\n\nAraç: ${rental.brandName} (${rental.modelYear})`);
    if (!confirmed) return;

    this.rentalService.markAsReturned(rental.id).subscribe(
      (res) => {
        if (res.success) {
          rental.status = 2 as any;
          this.toastrService.success('Araç teslim alındı olarak işaretlendi.', 'Başarılı');
        } else {
          this.toastrService.error(res.message || 'İşlem başarısız.', 'Hata');
        }
      },
      (err) => {
        this.toastrService.error('Sunucu hatası oluştu.', 'Hata');
      }
    );
  }

  confirmDelete(rental: RentalDetail) {
    const confirmed = confirm(`#${rental.id} numaralı kiralama silinsin mi?\n\nBu işlem geri alınamaz.\nAraç: ${rental.brandName} (${rental.modelYear})`);
    if (!confirmed) return;

    this.rentalService.deleteAndFreeCar(rental.id).subscribe(
      (res) => {
        if (res.success) {
          this.rentals = this.rentals.filter(r => r.id !== rental.id);
          this.filteredRentals = this.filteredRentals.filter(r => r.id !== rental.id);
          this.toastrService.success('Kiralama silindi, araç serbest bırakıldı.', 'Başarılı');
        } else {
          this.toastrService.error(res.message || 'Silme işlemi başarısız.', 'Hata');
        }
      },
      (err) => {
        this.toastrService.error('Sunucu hatası oluştu.', 'Hata');
      }
    );
  }
}