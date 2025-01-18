<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 88816fa (location and car component added)
import { Fuel } from './../../models/fuel';
import { FuelService } from './../../services/fuel.service';
import { Brand } from './../../models/brand';
import { Color } from './../../models/color';
import { Location } from './../../models/location';
<<<<<<< HEAD
>>>>>>> 88816fa (location and car component added)
=======
>>>>>>> 88816fa (location and car component added)
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CarService } from 'src/app/services/car.service';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { BrandService } from 'src/app/services/brand.service'; // Import BrandService
import { ColorService } from 'src/app/services/color.service'; // Import ColorService
import { LocationService } from 'src/app/services/location.service'; // Import LocationService
>>>>>>> 88816fa (location and car component added)
=======
import { BrandService } from 'src/app/services/brand.service'; // Import BrandService
import { ColorService } from 'src/app/services/color.service'; // Import ColorService
import { LocationService } from 'src/app/services/location.service'; // Import LocationService
>>>>>>> 88816fa (location and car component added)

@Component({
  selector: 'app-car-add',
  templateUrl: './car-add.component.html',
  styleUrls: ['./car-add.component.css']
})
export class CarAddComponent implements OnInit {
<<<<<<< HEAD
<<<<<<< HEAD
  carAddForm:FormGroup;

  constructor(private formBuilder:FormBuilder,private carService:CarService,
    private toastrService:ToastrService) {}
  ngOnInit(): void {
    this.createCarAddForm();
  }

  createCarAddForm(){
    this.carAddForm=this.formBuilder.group({
      brandId:["", Validators.required],
      colorId: ["", Validators.required],
      modelYear: ["", Validators.required],
      dailyPrice: ["", Validators.required],
      description: ["", Validators.required]
    })
  }

  add(){
    if(this.carAddForm.valid){
      let carmodel= Object.assign({},this.carAddForm.value)
      this.carService.add(carmodel).subscribe(data =>{
        this.toastrService.success("Araba Eklendi","Başarılı")
      }, responseError => {
        if(responseError.error.Errors.length>0)
        {
          for (let i = 0; i < responseError.error.Errors.length; i++) {
            this.toastrService.error(responseError.error.Errors[i].ErrorMessage,"Doğrulama Hatası")     
          }
        }

      } )
    }
    else{
      this.toastrService.error("Formunuz Eksik","Dikkat")
=======
=======
>>>>>>> 88816fa (location and car component added)
  carAddForm: FormGroup;
  brands: Brand[] = []; // Array to hold brand data
  colors: Color[] = []; // Array to hold color data
  locations: Location[] = []; // Array to hold location data
  fuels: Fuel[] = []; // Array to hold fuel data

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

      // Map brandName, colorName, and locationName to their corresponding IDs
      const selectedBrand = this.brands.find((brand) => brand.brandName === carModel.brandName);
      const selectedColor = this.colors.find((color) => color.colorName === carModel.colorName);
      const selectedLocation = this.locations.find((location) => location.locationName === carModel.locationName);
      const selectedFuel = this.fuels.find((fuel) => fuel.fuelName === carModel.fuelName);

      if (selectedBrand && selectedColor && selectedLocation) {
        carModel.brandId = selectedBrand.brandId;
        carModel.colorId = selectedColor.colorId;
        carModel.locationId = selectedLocation.locationId;
        carModel.fuelId = selectedFuel.fuelId;

        this.carService.add(carModel).subscribe(
          (data) => {
            this.toastrService.success('Car added successfully', 'Success');
          },
          (responseError) => {
            // Handle errors
          }
        );
      } else {
        this.toastrService.error('Invalid brand, color, or location selection', 'Error');
      }
    } else {
      this.toastrService.error('Form is incomplete', 'Attention');
<<<<<<< HEAD
>>>>>>> 88816fa (location and car component added)
=======
>>>>>>> 88816fa (location and car component added)
    }
  }
}
