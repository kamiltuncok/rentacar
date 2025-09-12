<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CartService } from 'src/app/services/cart.service';
import { CarService } from 'src/app/services/car.service';
import { ActivatedRoute } from '@angular/router';
=======
import { CustomerType } from './../../models/rental';
import { IndividualCustomerService } from './../../services/individual-customer.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CarService } from 'src/app/services/car.service';
import { CustomerService } from 'src/app/services/customer.service';
import { RentalService } from 'src/app/services/rental.service';
import { AuthService } from 'src/app/services/auth.service';
import { formatDate } from '@angular/common';
>>>>>>> 88816fa (location and car component added)

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
<<<<<<< HEAD
  carDetails:CarDetail[]=[];

  carDetail:CarDetail;


  constructor(private activatedRoute:ActivatedRoute,
    private carService:CarService,
    private toastrService:ToastrService,
    private cartService:CartService) {}

  ngOnInit():void {
    this.activatedRoute.params.subscribe(params=> {  
      this.getCarById(params["carId"]);
    })
  }
  getCarById(carId:number){
    this.carService.getCarDetailById(carId).subscribe(response=>{
     this.carDetail=response.data;
    })
  }
  pay(car:CarDetail){
      this.toastrService.success("Araba Kiralandı",car.description)
      this.cartService.pay(car);
   }
=======
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
      let customerModel = Object.assign({}, this.customerAddForm.value);
      this.customerService.add(customerModel).subscribe(
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
      customerType: [CustomerType.Individual]
    });
  }

  addRentalEntry() {
    if (this.rentalForm.valid) {
      const rentalModel = Object.assign({}, this.rentalForm.value);
      this.rentalService.add(rentalModel).subscribe(
        (data) => {
          this.toastrService.success('Kiralama Başarılı');
          this.carService.carisrented(rentalModel.carId).subscribe(
            () => {
              // Araç kiralandı durumu güncellendi
            },
            (error) => {
              this.toastrService.error('Aracın kiralandı durumu güncellenirken bir hata oluştu.', 'Hata');
            }
          );
        },
        (responseError) => {
          if (responseError.error && responseError.error.errors) {
            const errors = responseError.error.errors;
            if (Object.keys(errors).length > 0) {
              for (let key in errors) {
                if (errors.hasOwnProperty(key)) {
                  errors[key].forEach((error: string) => {
                    this.toastrService.error(error, 'Doğrulama Hatası');
                  });
                }
              }
            } else {
              this.toastrService.error('Kiralama işlemi sırasında bir hata oluştu.', 'Hata');
            }
          } else {
            this.toastrService.error('Kiralama işlemi sırasında bir hata oluştu.', 'Hata');
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
          this.customerId = response.data.customerId; // Örnek olarak, user tablosundan müşteriye ait bir alan
          this.customerAddForm.patchValue({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            identityNumber: response.data.identityNumber,
            phoneNumber: response.data.phoneNumber,
            email: response.data.email,
            address: response.data.address
          });
          this.hideCustomerInfo = false; // Kullanıcı giriş yapmışsa müşteri bilgisi sayfasını göster
        },
        (error: any) => {
          this.toastrService.error('Müşteri bilgisi alınamadı.', 'Hata');
        }
      );
    }
  }
>>>>>>> 88816fa (location and car component added)
}
