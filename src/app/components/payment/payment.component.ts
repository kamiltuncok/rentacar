import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { formatDate, NgIf, NgFor, DecimalPipe } from '@angular/common';

import { CarDetail } from 'src/app/models/carDetail';
import { CarService } from 'src/app/services/car.service';
import { RentalService, RentalCreateRequestDto, GuestRentalCreateRequestDto } from './../../services/rental.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  imports: [NgIf, NgFor, FormsModule, ReactiveFormsModule, DecimalPipe]
})
export class PaymentComponent implements OnInit {
  carDetail: CarDetail;
  rentalForm: FormGroup;
  paymentForm: FormGroup;
  rentdate: string;
  returndate: string;
  GettingCarId: number;
  locationName: string;
  locationEndName: string;
  startLocationId: number = 1;
  endLocationId: number = 1;
  isUserAuthenticated: boolean = false;
  customerType: number = 0; // 0=Individual, 1=Corporate

  // Guest Forms
  guestIndividualForm: FormGroup;
  guestCorporateForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private carService: CarService,
    private formBuilder: FormBuilder,
    private rentalService: RentalService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.checkAuthentication();
    this.createGuestForms();
    this.createPaymentForm();

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
      this.customerType = Number(queryParams['customerType']) || 0;

      // Ensure valid dates formatting for backend consumption
      if (from && startTime) this.rentdate = `${from}T${startTime}:00`;
      if (to && endTime) this.returndate = `${to}T${endTime}:00`;
    });
  }

  getCarById(carId: number) {
    this.carService.getCarDetailById(carId).subscribe((response) => {
      if (response && response.data) {
        this.carDetail = response.data;
        this.GettingCarId = this.carDetail.id;
        this.createRentalForm();
      }
    });
  }

  createRentalForm() {
    this.rentalForm = this.formBuilder.group({
      carId: [this.GettingCarId || 0, Validators.required],
      startLocationId: [this.startLocationId, Validators.required],
      endLocationId: [this.endLocationId, Validators.required],
      startDate: [this.rentdate, Validators.required],
      endDate: [this.returndate, Validators.required]
    });
  }

  checkAuthentication() {
    this.isUserAuthenticated = this.authService.isAuthenticated();
  }

  createGuestForms() {
    this.guestIndividualForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identityNumber: ['', [Validators.required, Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.guestCorporateForm = this.formBuilder.group({
      companyName: ['', Validators.required],
      taxNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  createPaymentForm() {
    this.paymentForm = this.formBuilder.group({
      cardHolder: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      expireMonth: ['', Validators.required],
      expireYear: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
  }

  addRentalEntry() {
    if (!this.isUserAuthenticated) {
      this.processGuestCheckout();
      return;
    }

    this.executeRental();
  }

  processGuestCheckout() {
    if (this.paymentForm.invalid) {
      this.toastrService.warning('Lütfen ödeme bilgilerinizi eksiksiz ve doğru girin.', 'Uyarı');
      return;
    }

    if (this.customerType === 0) {
      if (this.guestIndividualForm && this.guestIndividualForm.valid) {
        this.executeGuestRental();
      } else {
        this.toastrService.warning('Lütfen bireysel müşteri bilgilerinizi eksiksiz girin.', 'Uyarı');
      }
    } else {
      if (this.guestCorporateForm && this.guestCorporateForm.valid) {
        this.executeGuestRental();
      } else {
        this.toastrService.warning('Lütfen kurumsal müşteri bilgilerinizi eksiksiz girin.', 'Uyarı');
      }
    }
  }

  executeGuestRental() {
    if (this.rentalForm.invalid) {
      this.toastrService.error('Kiralama bilgileri eksik veya hatalı', 'Dikkat');
      return;
    }

    const formValue = this.rentalForm.value;

    // Base request data
    let requestDto: GuestRentalCreateRequestDto = {
      carId: Number(formValue.carId),
      startLocationId: Number(formValue.startLocationId),
      endLocationId: Number(formValue.endLocationId),
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      customerType: this.customerType,
      email: ''
    };

    if (this.customerType === 0) {
      const indv = this.guestIndividualForm.value;
      requestDto.firstName = indv.firstName;
      requestDto.lastName = indv.lastName;
      requestDto.identityNumber = indv.identityNumber;
      requestDto.email = indv.email;
    } else {
      const corp = this.guestCorporateForm.value;
      requestDto.companyName = corp.companyName;
      requestDto.taxNumber = corp.taxNumber;
      requestDto.phoneNumber = corp.phoneNumber;
      requestDto.email = corp.email;
      requestDto.address = corp.address;
    }

    this.rentalService.createGuestRental(requestDto).subscribe(
      (response: any) => {
        if (response.success) {
          this.toastrService.success('Kayıtsız misafir olarak kiralama başarılı.', 'Tebrikler');
          this.router.navigate(['/']);
        } else {
          this.toastrService.error(response.message || 'Kiralama işlemi başarısız', 'Hata');
        }
      },
      (error: any) => {
        this.handleError(error, 'Kiralama işlemi sırasında bir hata oluştu.');
      }
    );
  }

  executeRental() {
    if (this.paymentForm.invalid) {
      this.toastrService.warning('Lütfen ödeme bilgilerinizi eksiksiz ve doğru girin.', 'Uyarı');
      return;
    }

    if (this.rentalForm.valid) {
      const formValue = this.rentalForm.value;

      const requestDto: RentalCreateRequestDto = {
        carId: Number(formValue.carId),
        startLocationId: Number(formValue.startLocationId),
        endLocationId: Number(formValue.endLocationId),
        startDate: formValue.startDate,
        endDate: formValue.endDate
      };

      this.rentalService.createRental(requestDto).subscribe(
        (response: any) => {
          if (response.success) {
            this.toastrService.success('Kiralama Başarılı. Kiralamalarım sayfasından takip edebilirsiniz.', 'Tebrikler');
            this.router.navigate(['/']);
          } else {
            this.toastrService.error(response.message || 'Kiralama işlemi başarısız', 'Hata');
          }
        },
        (responseError: any) => {
          this.handleError(responseError, 'Kiralama işlemi sırasında bir hata oluştu.');
        }
      );
    } else {
      this.toastrService.error('Kiralama bilgileri eksik veya hatalı', 'Dikkat');
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
}