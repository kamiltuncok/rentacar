import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate, NgIf } from '@angular/common';

import { CarDetail } from 'src/app/models/carDetail';
import { CustomerType } from './../../models/rental';

import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';
import { IndividualCustomerService } from './../../services/individual-customer.service';
import { RentalService } from './../../services/rental.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

interface ErrorModel {
  ErrorMessage: string;
}

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css'],
    imports: [NgIf, FormsModule, ReactiveFormsModule]
})
export class PaymentComponent implements OnInit {
  carDetail: CarDetail;
  customerAddForm: FormGroup;
  rentalForm: FormGroup;
  customerId: number;
  userId: number;
  rentdate: string;
  returndate: string;
  GettingCarId: number;
  locationName: string;
  locationEndName: string;
  hideCustomerInfo: boolean = true;
  customerType: CustomerType;
  isUserAuthenticated: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private carService: CarService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private customerService: IndividualCustomerService,
    private rentalService: RentalService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.getCarById(params['carId']);
    });

    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const from = queryParams['from'];
      const startTime = queryParams['startTime'];
      const to = queryParams['to'];
      const endTime = queryParams['endTime'];

      this.locationName = queryParams['locationName'];
      this.locationEndName = queryParams['locationEndName'];

      this.rentdate = `${from} ${startTime}`;
      this.returndate = `${to} ${endTime}`;
    });

    this.createCustomerAddForm();
    this.checkAuthentication();
  }

  getCarById(carId: number) {
    this.carService.getCarDetailById(carId).subscribe((response) => {
      this.carDetail = response.data;
      this.GettingCarId = this.carDetail.carId;
      this.createRentalForm();
    });
  }

  createCustomerAddForm() {
    this.customerAddForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identityNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  createRentalForm() {
    const formattedRentDate = formatDate(this.rentdate, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'en-US');
    const formattedReturnDate = formatDate(this.returndate, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'en-US');

    const formattedRentDateWithoutOffset = formattedRentDate.replace(/[+-]\d{4}$/, 'Z');
    const formattedReturnDateWithoutOffset = formattedReturnDate.replace(/[+-]\d{4}$/, 'Z');

    // Tüm numeric alanları number olarak tanımla
    this.rentalForm = this.formBuilder.group({
      carId: [this.GettingCarId || 0, Validators.required],
      customerId: [0, Validators.required],
      userId: [0, Validators.required],
      rentDate: [formattedRentDateWithoutOffset, Validators.required],
      returnDate: [formattedReturnDateWithoutOffset, Validators.required],
      startLocation: [this.locationName, Validators.required],
      endLocation: [this.locationEndName, Validators.required],
      isReturned: [false, Validators.required],
      customerType: [CustomerType.Individual, Validators.required]
    });

    this.updateRentalFormBasedOnAuth();
  }

checkAuthentication() {
  this.isUserAuthenticated = this.authService.isAuthenticated();
  const userType = this.authService.getCustomerType();
  
  if (this.isUserAuthenticated && userType === "Individual") {
    this.hideCustomerInfo = true;
  } else {
    this.hideCustomerInfo = false;
  }

  if (this.rentalForm) {
    this.updateRentalFormBasedOnAuth();
  }
}

  updateRentalFormBasedOnAuth() {
    if (this.isUserAuthenticated && this.userId) {
      // userId'yi NUMBER olarak set et
      this.rentalForm.patchValue({
        userId: Number(this.userId), // String'i number'a çevir
        customerId: 0
      });

    } else {
      this.rentalForm.patchValue({
        userId: 0,
        customerId: 0
      });

    }
  }

  addCustomerAndRental() {

    
    if (this.isUserAuthenticated) {
      this.addRentalEntry();
    } else {
      this.addCustomerThenRental();
    }
  }

  addCustomerThenRental() {

    
    if (this.customerAddForm.valid) {
      const customerModel = Object.assign({}, this.customerAddForm.value);

      
      this.customerService.add(customerModel).subscribe(
        (response: any) => {
          if (response.success) {
            this.customerId = response.data.customerId;
            this.toastrService.success('Müşteri Eklendi', 'Başarılı');
            
            // customerId'yi NUMBER olarak set et
            this.rentalForm.patchValue({
              customerId: Number(this.customerId),
              userId: 0
            });
            

            this.addRentalEntry();
          }
        },
        (responseError: any) => {
          this.handleError(responseError, 'Müşteri eklenirken bir hata oluştu.');
        }
      );
    } else {
      this.toastrService.error('Müşteri formu eksik veya hatalı', 'Dikkat');
      this.markFormGroupTouched(this.customerAddForm);
    }
  }

  addRentalEntry() {
    
    // Form değerlerini number'a çevir
    const formValue = this.rentalForm.value;
    const rentalModel = {
      ...formValue,
      carId: Number(formValue.carId),
      customerId: Number(formValue.customerId),
      userId: Number(formValue.userId),
      customerType: Number(formValue.customerType)
    };
    
    
    if (this.rentalForm.valid) {
      this.rentalService.add(rentalModel).subscribe(
        (response: any) => {
          if (response.success) {
            this.toastrService.success('Kiralama Başarılı', 'Tebrikler');
            this.carService.carisrented(rentalModel.carId).subscribe(() => {
            });
            this.router.navigate(['/success']);
          } else {
            this.toastrService.error(response.message || 'Kiralama işlemi başarısız', 'Hata');
          }
        },
        (responseError: any) => {
          // Daha detaylı hata bilgisi
          if (responseError.error?.errors) {
          }
          this.handleError(responseError, 'Kiralama işlemi sırasında bir hata oluştu.');
        }
      );
    } else {
      this.toastrService.error('Kiralama formu eksik veya hatalı', 'Dikkat');
      this.markFormGroupTouched(this.rentalForm);
    }
  }

  getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.rentalForm.controls).forEach(key => {
      const controlErrors = this.rentalForm.get(key)?.errors;
      if (controlErrors) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }

  handleError(responseError: any, defaultMessage: string) {
    
    // Validation errors detaylı gösterim
    if (responseError.error?.errors) {
      const validationErrors = responseError.error.errors;
      Object.keys(validationErrors).forEach(key => {
        validationErrors[key].forEach((err: string) => {
          this.toastrService.error(`${key}: ${err}`, 'Doğrulama Hatası');
        });
      });
    }
    else if (responseError.error?.Errors && responseError.error.Errors.length > 0) {
      responseError.error.Errors.forEach((err: ErrorModel) => {
        this.toastrService.error(err.ErrorMessage, 'Doğrulama Hatası');
      });
    } else if (responseError.error?.message) {
      this.toastrService.error(responseError.error.message, 'Hata');
    } else if (responseError.status === 400) {
      this.toastrService.error('Geçersiz istek. Lütfen bilgilerinizi kontrol edin.', 'Hata');
    } else {
      this.toastrService.error(defaultMessage, 'Hata');
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}