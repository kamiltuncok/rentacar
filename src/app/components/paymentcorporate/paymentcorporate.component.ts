import { CustomerType } from './../../models/rental';
import { CorporateUserService } from 'src/app/services/corporate-user.service';
import { CorporateCustomerService } from './../../services/corporate-customer.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarService } from 'src/app/services/car.service';
import { RentalService } from 'src/app/services/rental.service';
import { AuthService } from 'src/app/services/auth.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-paymentcorporate',
  templateUrl: './paymentcorporate.component.html',
  styleUrls: ['./paymentcorporate.component.css']
})

export class PaymentcorporateComponent {
  carDetail: any;
  customerAddForm: FormGroup;
  rentalForm: FormGroup;
  customerId: number;
  rentdate: string;
  returndate: string;
  GettingCarId: number;
  locationName: string;
  locationEndName: string;
  hideCustomerInfo: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private carService: CarService,
    private formBuilder: FormBuilder,
    private rentalService: RentalService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private corporateCustomerService: CorporateCustomerService,
    private userService: CorporateUserService
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
    this.getCustomerInfo(); // Müşteri bilgisi kontrolü
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
      companyName: ['', Validators.required],
      taxNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  addCorporateCustomerAndRental() {
    if (this.customerAddForm.valid) {
      let customerModel = Object.assign({}, this.customerAddForm.value);
      this.corporateCustomerService.add(customerModel).subscribe(
        (response: any) => {
          if (response.success) {
            this.customerId = response.data.customerId; // CustomerId'yi al
            this.toastrService.success('Müşteri Eklendi', 'Başarılı');
            this.rentalForm.get('customerId').patchValue(this.customerId);
            this.addRentalEntry();
          }
        },
        (responseError) => {
          if (responseError.error.Errors && responseError.error.Errors.length > 0) {
            for (let i = 0; i < responseError.error.Errors.length; i++) {
              this.toastrService.error(
                responseError.error.Errors[i].ErrorMessage,
                'Doğrulama Hatası'
              );
            }
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
    const formattedRentDate = formatDate(
      this.rentdate,
      'yyyy-MM-ddTHH:mm:ss.SSSZ',
      'en-US'
    );
    const formattedReturnDate = formatDate(
      this.returndate,
      'yyyy-MM-ddTHH:mm:ss.SSSZ',
      'en-US'
    );

    const formattedRentDateWithoutOffset = formattedRentDate.replace(
      /[+-]\d{4}$/,
      'Z'
    );
    const formattedReturnDateWithoutOffset = formattedReturnDate.replace(
      /[+-]\d{4}$/,
      'Z'
    );

    this.rentalForm = this.formBuilder.group({
      carId: [this.GettingCarId, Validators.required],
      customerId: [null, Validators.required],
      rentDate: [formattedRentDateWithoutOffset, Validators.required],
      returnDate: [formattedReturnDateWithoutOffset, Validators.required],
      startLocation: [this.locationName, Validators.required],
      endLocation: [this.locationEndName, Validators.required],
      customerType: [CustomerType.Corporate] 
    });
  }

  addRentalEntry() {
    if (this.rentalForm.valid) {
      const rentalModel = Object.assign({}, this.rentalForm.value);
      this.rentalService.add(rentalModel).subscribe(
        (data) => {
          this.toastrService.success('Kiralama Başarılı');
          this.toastrService.success(data.message, 'Başarılı');
          // Kiralama işlemi başarılıysa aracı kiralandı olarak işaretle
          this.carService.carisrented(rentalModel.carId).subscribe(
            () => {
              // İşlemlerinize devam edin
            },
            (error) => {
              this.toastrService.error('Aracın kiralandı durumu güncellenirken bir hata oluştu.', 'Hata');
            }
          );
        },
        (responseError) => {
          const errors = responseError.error?.Errors || [];
          if (errors.length > 0) {
            for (let i = 0; i < errors.length; i++) {
              this.toastrService.error(errors[i]?.ErrorMessage || 'Bilinmeyen bir hata oluştu', 'Doğrulama Hatası');
            }
          } else {
            this.toastrService.error('Bilinmeyen bir hata oluştu', 'Hata');
          }
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
            companyName: response.data.companyName,
            taxNumber: response.data.taxNumber,
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
