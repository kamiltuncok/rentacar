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

@Component({
  selector: 'app-location-manager-rentals',
  templateUrl: './location-manager-rentals.component.html',
  styleUrls: ['./location-manager-rentals.component.css']
})
export class LocationManagerRentalsComponent implements OnInit {
  rentals: RentalDetail[] = [];
  userDetails: { [key: string]: any } = {};
  isLoading: boolean = false;
  userId: number;
  defaultImageUrl: string = "https://localhost:44306/Uploads/Images/default-car-image.jpg";

  constructor(
    private locationOperationClaimService: LocationOperationClaimService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private userService: UserService,
    private corporateUserService: CorporateUserService,
    private customerService: CustomerService,
    private corporateCustomerService: CorporateCustomerService
  ) {}

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
}