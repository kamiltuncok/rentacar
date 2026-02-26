import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CarService } from 'src/app/services/car.service';

@Component({
    selector: 'app-car-update',
    templateUrl: './car-update.component.html',
    styleUrls: ['./car-update.component.css'],
    imports: [FormsModule, ReactiveFormsModule]
})
export class CarUpdateComponent implements OnInit {
  car = new FormGroup({
    brandId: new FormControl(null, [Validators.required]),
    colorId: new FormControl(null, Validators.required),
    modelYear: new FormControl(null, Validators.required),
    dailyPrice: new FormControl(null, Validators.required),
    description: new FormControl('', Validators.required),
  });

  constructor(
    private carService: CarService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const carId = Number(this.router.snapshot.paramMap.get('id'));
    this.carService.getCarsById(carId).subscribe((result: any) => {
      if (result.data && result.data.length > 0) {
        this.car.patchValue({
          ...result.data[0]
        });
      } else if (result.data) {
        this.car = new FormGroup({
          brandId: new FormControl(result.data["brandId"], Validators.required),
          colorId: new FormControl(result.data["colorId"], Validators.required),
          modelYear: new FormControl(result.data["modelYear"], Validators.required),
          dailyPrice: new FormControl(result.data["dailyPrice"], Validators.required),
          description: new FormControl(result.data["description"], Validators.required),
        });
      }
    });
  }

  UpdateData() {
    if (this.car.valid) {
      const carId = Number(this.router.snapshot.paramMap.get('id'));
      const car: CarDetail = Object.assign(
        { id: carId },
        { brandId: this.car.value.brandId },
        { colorId: this.car.value.colorId },
        { modelYear: this.car.value.modelYear },
        { dailyPrice: this.car.value.dailyPrice },
        { description: this.car.value.description }
      );

      this.carService.update(car).subscribe(
        (response) => {
          this.toastrService.success(response.message);
        },
        (responseError) => {
          this.toastrService.error(responseError.error);
        }
      );
    }
  }
}
