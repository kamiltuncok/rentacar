import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';

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
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  carDetail: CarDetail;
  customerAddForm: FormGroup;
  rentalForm: FormGroup;
  customerId: number;
  rentdate: string;
  returndate: string;
  GettingCarId: number;
  locationName: string;
  locationEndName: string;
  hideCustomerInfo: boolean = true;
  customerType: CustomerType;

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
    this.createRentalForm();
    this.getCustomerInfo();
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
      email: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  addCustomerAndRental() {
    if (this.customerAddForm.valid) {
      const customerModel = Object.assign({}, this.customerAddForm.value);
      this.customerService.add(customerModel).subscribe(
        (response: any) => {
          if (response.success) {
            this.customerId = response.data.customerId;
            this.toastrService.success('Müşteri Eklendi', 'Başarılı');
            this.rentalForm.get('customerId')?.patchValue(this.customerId);
            this.addRentalEntry();
          }
        },
        (responseError: any) => {
          if (responseError.error?.Errors && responseError.error.Errors.length > 0) {
            responseError.error.Errors.forEach((err: ErrorModel) => {
              this.toastrService.error(err.ErrorMessage, 'Doğrulama Hatası');
            });
          } else {
            this.toastrService.error('Müşteri eklenirken bir hata oluştu.', 'Hata');
          }
        }
      );
    } else {
      this.toastrService.error('Formunuz Eksik veya Hatalı', 'Dikkat');
    }
  }

  createRentalForm() {
    const formattedRentDate = formatDate(this.rentdate, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'en-US');
    const formattedReturnDate = formatDate(this.returndate, 'yyyy-MM-ddTHH:mm:ss.SSSZ', 'en-US');

    const formattedRentDateWithoutOffset = formattedRentDate.replace(/[+-]\d{4}$/, 'Z');
    const formattedReturnDateWithoutOffset = formattedReturnDate.replace(/[+-]\d{4}$/, 'Z');

    this.rentalForm = this.formBuilder.group({
      carId: [this.GettingCarId, Validators.required],
      customerId: [null, Validators.required],
      rentDate: [formattedRentDateWithoutOffset, Validators.required],
      returnDate: [formattedReturnDateWithoutOffset, Validators.required],
      startLocation: [this.locationName, Validators.required],
      endLocation: [this.locationEndName, Validators.required],
      customerType: [CustomerType.Individual]
    });
  }

  addRentalEntry() {
    if (this.rentalForm.valid) {
      const rentalModel = Object.assign({}, this.rentalForm.value);
      this.rentalService.add(rentalModel).subscribe(
        () => {
          this.toastrService.success('Kiralama Başarılı');
          this.carService.carisrented(rentalModel.carId).subscribe();
        },
        (responseError: any) => {
          this.toastrService.error('Kiralama işlemi sırasında bir hata oluştu.', 'Hata');
        }
      );
    } else {
      this.toastrService.error('Formunuz Eksik veya Hatalı', 'Dikkat');
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  getCustomerInfo() {
    if (this.isAuthenticated()) {
      const userId = this.authService.getCurrentUserId;
      this.userService.getUserById(userId).subscribe(
        (response: any) => {
          this.customerId = response.data.customerId;
          this.customerAddForm.patchValue({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            identityNumber: response.data.identityNumber,
            phoneNumber: response.data.phoneNumber,
            email: response.data.email,
            address: response.data.address
          });
          this.hideCustomerInfo = false;
        },
        (error: any) => {
          this.toastrService.error('Müşteri bilgisi alınamadı.', 'Hata');
        }
      );
    }
  }
}
