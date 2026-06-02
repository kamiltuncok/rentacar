import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CarImageService } from './../../services/car-image.service';
import { CarService } from './../../services/car.service';
import { CarDetail } from './../../models/carDetail';

@Component({
    selector: 'app-car-image-add',
    templateUrl: './car-image-add.component.html',
    styleUrls: ['./car-image-add.component.css'],
    imports: [FormsModule, ReactiveFormsModule, NgFor, NgIf]
})
export class CarImageAddComponent implements OnInit {
  carImageAddForm: FormGroup;
  cars: CarDetail[] = [];
  file: File;

  constructor(
    private formBuilder: FormBuilder,
    private carImageService: CarImageService,
    private carService: CarService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createCarImageAddForm();
    this.getCars();
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  createCarImageAddForm() {
    this.carImageAddForm = this.formBuilder.group({
      carId: ['', Validators.required]
    });
  }

  getCars() {
    this.carService.getCarDetails().subscribe((response) => {
      this.cars = response.data;
    });
  }

  addCarImage() {
    if (this.carImageAddForm.valid) {
      if (!this.file) {
        this.toastrService.error('Lütfen bir resim seçiniz.', 'Hata');
        return;
      }

      const carId = this.carImageAddForm.value.carId;

      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('carId', carId.toString());

      this.carImageService.add(formData).subscribe(
        (data) => {
          this.toastrService.success('Araba resmi başarıyla eklendi.', 'Başarılı');
          this.carImageAddForm.reset({ carId: '' });
          this.file = null!;
        },
        (responseError) => {
          if (responseError.error && responseError.error.message) {
            this.toastrService.error(responseError.error.message, 'Hata');
          } else {
            this.toastrService.error('Resim yüklenirken hata oluştu.', 'Hata');
          }
        }
      );
    } else {
      this.toastrService.error('Form eksik dolduruldu.', 'Dikkat');
    }
  }
}
