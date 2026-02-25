import { Component, OnInit } from '@angular/core';
import { RentalDetail } from 'src/app/models/rentalDetail';
import { LocationOperationClaimService } from 'src/app/services/location-operation-claim.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerType } from 'src/app/models/rental';
import { UserService } from 'src/app/services/user.service';
import { CorporateUserService } from 'src/app/services/corporate-user.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CorporateCustomerService } from 'src/app/services/corporate-customer.service';
import { User } from 'src/app/models/user';
import { CorporateUser } from 'src/app/models/corporateUser';
import { Customer } from 'src/app/models/customer';
import { CorporateCustomer } from 'src/app/models/corporateCustomer';
import { RentalService } from 'src/app/services/rental.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-location-manager-rentals',
  templateUrl: './location-manager-rentals.component.html',
  styleUrls: ['./location-manager-rentals.component.css']
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
    private locationOperationClaimService: LocationOperationClaimService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private userService: UserService,
    private corporateUserService: CorporateUserService,
    private customerService: CustomerService,
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

    this.locationOperationClaimService.getRentalsByManagerLocation(this.userId).subscribe(
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
          if (dateIds !== null && !dateIds.has(r.rentalId)) return false;
          if (emailIds !== null && !emailIds.has(r.rentalId)) return false;
          if (nameIds !== null && !nameIds.has(r.rentalId)) return false;
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
      // Senaryo 1: UserId ≠ 0 ve CustomerType = Individual
      if (rental.userId !== 0 && rental.customerType === CustomerType.Individual) {
        const key = `user_${rental.userId}`;
        if (!this.userDetails[key]) {
          return this.userService.getUserById(rental.userId).toPromise()
            .then(result => {
              if (result && result.success) {
                this.userDetails[key] = {
                  type: 'IndividualUser',
                  data: result.data
                };
              }
            });
        }
      }
      // Senaryo 2: UserId ≠ 0 ve CustomerType = Corporate
      else if (rental.userId !== 0 && rental.customerType === CustomerType.Corporate) {
        const key = `user_${rental.userId}`;
        if (!this.userDetails[key]) {
          return this.corporateUserService.getUserById(rental.userId).toPromise()
            .then(result => {
              if (result && result.success) {
                this.userDetails[key] = {
                  type: 'CorporateUser',
                  data: result.data
                };
              }
            });
        }
      }
      // Senaryo 3: CustomerId ≠ 0 ve CustomerType = Individual
      else if (rental.customerId !== 0 && rental.customerType === CustomerType.Individual) {
        const key = `customer_${rental.customerId}`;
        if (!this.userDetails[key]) {
          return this.customerService.getCustomerById(rental.customerId).toPromise()
            .then(result => {
              if (result && result.success) {
                this.userDetails[key] = {
                  type: 'IndividualCustomer',
                  data: result.data
                };
              }
            });
        }
      }
      // Senaryo 4: CustomerId ≠ 0 ve CustomerType = Corporate
      else if (rental.customerId !== 0 && rental.customerType === CustomerType.Corporate) {
        const key = `customer_${rental.customerId}`;
        if (!this.userDetails[key]) {
          return this.corporateCustomerService.getCustomerById(rental.customerId).toPromise()
            .then(result => {
              if (result && result.success) {
                this.userDetails[key] = {
                  type: 'CorporateCustomer',
                  data: result.data
                };
              }
            });
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
    let key: string;

    if (rental.userId !== 0) {
      key = `user_${rental.userId}`;
    } else if (rental.customerId !== 0) {
      key = `customer_${rental.customerId}`;
    } else {
      return null;
    }

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
          identityNumber: individualUser.identityNumber,
          address: individualUser.address
        };

      case 'CorporateUser':
        const corporateUser = userInfo.data as CorporateUser;
        return {
          type: 'Corporate',
          source: 'User',
          name: corporateUser.companyName,
          email: corporateUser.email,
          phone: corporateUser.phoneNumber,
          taxNumber: corporateUser.taxNumber,
          address: corporateUser.address
        };

      case 'IndividualCustomer':
        const individualCustomer = userInfo.data as Customer;
        return {
          type: 'Individual',
          source: 'Customer',
          name: `${individualCustomer.firstName} ${individualCustomer.lastName}`,
          email: individualCustomer.email,
          phone: individualCustomer.phoneNumber,
          identityNumber: individualCustomer.identityNumber,
          address: individualCustomer.address
        };

      case 'CorporateCustomer':
        const corporateCustomer = userInfo.data as CorporateCustomer;
        return {
          type: 'Corporate',
          source: 'Customer',
          name: corporateCustomer.companyName,
          email: corporateCustomer.email,
          phone: corporateCustomer.phoneNumber,
          taxNumber: corporateCustomer.taxNumber,
          address: corporateCustomer.address
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

  getStatusClass(isReturned: boolean): string {
    return isReturned ? 'badge-success' : 'badge-warning';
  }

  getStatusText(isReturned: boolean): string {
    return isReturned ? 'Teslim Edildi' : 'Aktif Kiralama';
  }

  getCustomerTypeText(customerType: number): string {
    switch (customerType) {
      case CustomerType.Individual: return 'Bireysel';
      case CustomerType.Corporate: return 'Kurumsal';
      case CustomerType.Admin: return 'Admin';
      case CustomerType.LocationManager: return 'Lokasyon Yöneticisi';
      default: return 'Bilinmiyor';
    }
  }

  confirmReturn(rental: RentalDetail) {
    if (rental.isReturned) {
      this.toastrService.info('Bu kiralama zaten teslim edildi.', 'Bilgi');
      return;
    }
    const confirmed = confirm(`#${rental.rentalId} numaralı kiralama teslim alındı olarak işaretlensin mi?\n\nAraç: ${rental.brandName} (${rental.modelYear})`);
    if (!confirmed) return;

    this.rentalService.markAsReturned(rental.rentalId).subscribe(
      (res) => {
        if (res.success) {
          rental.isReturned = true;
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
    const confirmed = confirm(`#${rental.rentalId} numaralı kiralama silinsin mi?\n\nBu işlem geri alınamaz.\nAraç: ${rental.brandName} (${rental.modelYear})`);
    if (!confirmed) return;

    this.rentalService.deleteAndFreeCar(rental.rentalId).subscribe(
      (res) => {
        if (res.success) {
          this.rentals = this.rentals.filter(r => r.rentalId !== rental.rentalId);
          this.filteredRentals = this.filteredRentals.filter(r => r.rentalId !== rental.rentalId);
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