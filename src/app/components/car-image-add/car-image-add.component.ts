import { Color } from './../../models/color';
import { Brand } from './../../models/brand';
import { ToastrService } from 'ngx-toastr';
import { ColorService } from './../../services/color.service';
import { BrandService } from './../../services/brand.service';
import { CarImageService } from './../../services/car-image.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-car-image-add',
  templateUrl: './car-image-add.component.html',
  styleUrls: ['./car-image-add.component.css']
})
export class CarImageAddComponent implements OnInit {
  carImageAddForm: FormGroup;
  brands: Brand[] = [];
  colors: Color[] = [];
  file: File;

  constructor(
    private formBuilder: FormBuilder,
    private carImageService: CarImageService,
    private brandService: BrandService,
    private colorService: ColorService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createCarImageAddForm();
    this.getBrands();
    this.getColors();
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  createCarImageAddForm() {
    this.carImageAddForm = this.formBuilder.group({
      brandName: [''],
      colorName: ['']
    });
  }

  getBrands() {
    this.brandService.getBrands().subscribe((response) => {
      this.brands = response.data;
    });
  }

  getColors() {
    this.colorService.getColors().subscribe((response) => {
      this.colors = response.data;
    });
  }

  addCarImage() {
    if (this.carImageAddForm.valid) {
      const carImageModel = Object.assign({}, this.carImageAddForm.value);

      const selectedBrand = this.brands.find((brand) => brand.brandName === this.carImageAddForm.value.brandName);
      const selectedColor = this.colors.find((color) => color.colorName === this.carImageAddForm.value.colorName);
  
      if (selectedBrand && selectedColor) {
        carImageModel.brandId = selectedBrand.brandId;
        carImageModel.colorId = selectedColor.colorId;

        // Create FormData and append the file
        const formData = new FormData();
        formData.append('file', this.file);

        // Append car image data
        for (const key in carImageModel) {
          formData.append(key, carImageModel[key]);
        }

        this.carImageService.add(formData).subscribe(
          (data) => {
            this.toastrService.success('Car image successfully', 'Success');
          },
          (responseError) => {
            // Handle errors
          }
        );
      } else {
        this.toastrService.error('Invalid brand or color selection', 'Error');
      }
    } else {
      this.toastrService.error('Form is incomplete', 'Attention');
    }
  }

}
