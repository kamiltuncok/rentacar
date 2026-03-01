import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CarService } from 'src/app/services/car.service';
import { BrandService } from 'src/app/services/brand.service';
import { ColorService } from 'src/app/services/color.service';
import { LocationService } from 'src/app/services/location.service';
import { FuelService } from './../../services/fuel.service';
import { GearService } from './../../services/gear.service';
import { SegmentService } from './../../services/segment.service';
import { Brand } from './../../models/brand';
import { Color } from './../../models/color';
import { Location } from './../../models/location';
import { Fuel } from './../../models/fuel';
import { Gear } from './../../models/gear';
import { Segment } from './../../models/segment';
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
  cities: { id: number, name: string }[] = [];
  fuels: Fuel[] = [];
  gears: Gear[] = [];
  segments: Segment[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private carService: CarService,
    private brandService: BrandService,
    private colorService: ColorService,
    private locationService: LocationService,
    private fuelService: FuelService,
    private gearService: GearService,
    private segmentService: SegmentService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.createCarAddForm();
    this.getBrands();
    this.getColors();
    this.getCities();
    this.getLocations();
    this.getFuels();
    this.getGears();
    this.getSegments();
  }

  createCarAddForm() {
    this.carAddForm = this.formBuilder.group({
      brandId: ['', Validators.required],
      colorId: ['', Validators.required],
      currentLocationId: ['', Validators.required],
      fuelId: ['', Validators.required],
      gearId: ['', Validators.required],
      segmentId: ['', Validators.required],
      modelYear: ['', [Validators.required, Validators.min(2000), Validators.max(2030)]],
      dailyPrice: ['', [Validators.required, Validators.min(1)]],
      deposit: ['', [Validators.required, Validators.min(0)]],
      plateNumber: ['', [Validators.required, Validators.minLength(5)]],
      km: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
    });
  }

  getCities() {
    this.locationService.getCities().subscribe(response => {
      if (response.success) {
        this.cities = response.data;
      }
    });
  }

  getCityName(cityId: number): string {
    const city = this.cities.find(c => c.id === cityId);
    return city ? city.name : 'Belirsiz';
  }

  getBrands() { this.brandService.getBrands().subscribe(r => this.brands = r.data); }
  getColors() { this.colorService.getColors().subscribe(r => this.colors = r.data); }
  getLocations() { this.locationService.getLocations().subscribe(r => this.locations = r.data); }
  getFuels() { this.fuelService.getFuels().subscribe(r => this.fuels = r.data); }
  getGears() { this.gearService.getGears().subscribe(r => this.gears = r.data); }
  getSegments() { this.segmentService.getSegments().subscribe(r => this.segments = r.data); }

  add() {
    if (this.carAddForm.valid) {
      const carModel = { ...this.carAddForm.value, status: 0 };
      this.carService.add(carModel).subscribe(
        () => this.toastrService.success('Araç başarıyla eklendi', 'Başarılı'),
        () => this.toastrService.error('Araç eklenirken hata oluştu', 'Hata')
      );
    } else {
      this.toastrService.error('Lütfen tüm alanları doldurun', 'Dikkat');
    }
  }
}
