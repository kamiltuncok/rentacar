import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate, NgIf } from '@angular/common';

import { CarDetail } from 'src/app/models/carDetail';

import { CarService } from 'src/app/services/car.service';
import { IndividualCustomerService } from './../../services/individual-customer.service';
import { RentalService } from './../../services/rental.service';
import { AuthService } from 'src/app/services/auth.service';

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
  startLocationId: number = 1;
  endLocationId: number = 1;
  hideCustomerInfo: boolean = true;
  isUserAuthenticated: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private carService: CarService,
    private formBuilder: FormBuilder,
    private customerService: IndividualCustomerService,
    private rentalService: RentalService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

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
      this.startLocationId = Number(queryParams['startLocationId']) || 1;
      this.endLocationId = Number(queryParams['endLocationId']) || 1;

      this.rentdate = `${from} ${startTime}`;
      this.returndate = `${to} ${endTime}`;
    });

    this.createCustomerAddForm();
    this.checkAuthentication();
  }

  getCarById(carId: number) {
    this.carService.getCarDetailById(carId).subscribe((response) => {
      this.carDetail = response.data;
      this.GettingCarId = this.carDetail.id;
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
    const formattedStart = formatDate(this.rentdate, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
    const formattedEnd = formatDate(this.returndate, 'yyyy-MM-ddTHH:mm:ss', 'en-US');

    this.rentalForm = this.formBuilder.group({
      carId: [this.GettingCarId || 0, Validators.required],
      customerId: [0, Validators.required],
      startLocationId: [this.startLocationId, Validators.required],
      endLocationId: [this.endLocationId, Validators.required],
      startDate: [formattedStart, Validators.required],
      endDate: [formattedEnd, Validators.required],
      rentedDailyPrice: [this.carDetail?.dailyPrice || 0],
      totalPrice: [0],
      depositAmount: [this.carDetail?.deposit || 0]
    });

    this.updateRentalFormBasedOnAuth();
  }

  checkAuthentication() {
    this.isUserAuthenticated = this.authService.isAuthenticated();
    const userType = this.authService.getCustomerType();

    if (this.isUserAuthenticated && userType === 'Individual') {
      this.hideCustomerInfo = true;
    } else {
      this.hideCustomerInfo = false;
    }

    if (this.rentalForm) {
      this.updateRentalFormBasedOnAuth();
    }
  }

  updateRentalFormBasedOnAuth() {
    this.rentalForm?.patchValue({ customerId: 0 });
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
            this.customerId = response.data.id;
            this.toastrService.success('Müşteri Eklendi', 'Başarılı');
            this.rentalForm.patchValue({ customerId: Number(this.customerId) });
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
    const formValue = this.rentalForm.value;
    const rentalModel = {
      ...formValue,
      carId: Number(formValue.carId),
      customerId: Number(formValue.customerId)
    };

    if (this.rentalForm.valid) {
      this.rentalService.add(rentalModel).subscribe(
        (response: any) => {
          if (response.success) {
            this.toastrService.success('Kiralama Başarılı', 'Tebrikler');
            this.router.navigate(['/success']);
          } else {
            this.toastrService.error(response.message || 'Kiralama işlemi başarısız', 'Hata');
          }
        },
        (responseError: any) => {
          this.handleError(responseError, 'Kiralama işlemi sırasında bir hata oluştu.');
        }
      );
    } else {
      this.toastrService.error('Kiralama formu eksik veya hatalı', 'Dikkat');
      this.markFormGroupTouched(this.rentalForm);
    }
  }

  handleError(responseError: any, defaultMessage: string) {
    if (responseError.error?.errors) {
      const validationErrors = responseError.error.errors;
      Object.keys(validationErrors).forEach(key => {
        validationErrors[key].forEach((err: string) => {
          this.toastrService.error(`${key}: ${err}`, 'Doğrulama Hatası');
        });
      });
    } else if (responseError.error?.message) {
      this.toastrService.error(responseError.error.message, 'Hata');
    } else {
      this.toastrService.error(defaultMessage, 'Hata');
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }
}