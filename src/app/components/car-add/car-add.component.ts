import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CarService } from 'src/app/services/car.service';
import { BrandService } from 'src/app/services/brand.service';
import { ColorService } from 'src/app/services/color.service';
import { LocationService } from 'src/app/services/location.service';
import { FuelService } from './../../services/fuel.service';
import { Brand } from './../../models/brand';
import { Color } from './../../models/color';
import { Location } from './../../models/location';
import { Fuel } from './../../models/fuel';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-car-add',
    templateUrl: './car-add.component.html',
    styleUrls: ['./car-add.component.css'],
    imports: [FormsModule, ReactiveFormsModule, NgFor]
})
export class CarAddComponent implements OnInit {
  carAddForm: FormGroup;
  brands: Brand[] = [];
  colors: Color[] = [];
  locations: Location[] = [];
  fuels: Fuel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private carService: CarService,
    private brandService: BrandService,
    private colorService: ColorService,
    private locationService: LocationService,
    private fuelService: FuelService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createCarAddForm();
    this.getBrands();
    this.getColors();
    this.getLocations();
    this.getFuels();
  }

  createCarAddForm() {
    this.carAddForm = this.formBuilder.group({
      brandName: ['', Validators.required],
      colorName: ['', Validators.required],
      locationName: ['', Validators.required],
      fuelName: ['', Validators.required],
      modelYear: ['', Validators.required],
      dailyPrice: ['', Validators.required],
      description: ['', Validators.required]
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

  getLocations() {
    this.locationService.getLocations().subscribe((response) => {
      this.locations = response.data;
    });
  }

  getFuels() {
    this.fuelService.getFuels().subscribe((response) => {
      this.fuels = response.data;
    });
  }

  add() {
    if (this.carAddForm.valid) {
      const carModel = Object.assign({}, this.carAddForm.value);

      const selectedBrand = this.brands.find((brand) => brand.brandName === carModel.brandName);
      const selectedColor = this.colors.find((color) => color.colorName === carModel.colorName);
      const selectedLocation = this.locations.find((location) => location.locationName === carModel.locationName);
      const selectedFuel = this.fuels.find((fuel) => fuel.fuelName === carModel.fuelName);

      if (selectedBrand && selectedColor && selectedLocation && selectedFuel) {
        carModel.brandId = selectedBrand.brandId;
        carModel.colorId = selectedColor.colorId;
        carModel.locationId = selectedLocation.locationId;
        carModel.fuelId = selectedFuel.fuelId;

        this.carService.add(carModel).subscribe(
          (data) => {
            this.toastrService.success('Car added successfully', 'Success');
          },
          (responseError) => {
            // Handle validation errors
          }
        );
      } else {
        this.toastrService.error('Invalid brand, color, location, or fuel selection', 'Error');
      }
    } else {
      this.toastrService.error('Form is incomplete', 'Attention');
    }
  }
}
