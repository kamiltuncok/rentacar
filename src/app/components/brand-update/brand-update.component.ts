import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-brand-update',
  templateUrl: './brand-update.component.html',
  styleUrls: ['./brand-update.component.css']
})
export class BrandUpdateComponent implements OnInit {
  updateFormGroup: FormGroup;
  brand = new FormGroup({
    brandName: new FormControl(null, [Validators.required]),
  });

  constructor(
    private brandService: BrandService,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    const brandId = Number(this.router.snapshot.paramMap.get('brandId'));
    this.brandService.getBrandsById(brandId).subscribe((result: any) => {
      if (result.data && result.data.length > 0) {
        this.brand.patchValue({
          ...result.data[0]
        });
      } else if (result.data) {
        // Fallback for single object response
        this.brand = new FormGroup({
          brandName: new FormControl(result.data["brandName"], Validators.required),
        });
      }
    });
  }

  UpdataData() {
    if (this.brand.valid) {
      const brandId = Number(this.router.snapshot.paramMap.get('brandId'));
      const brand: Brand = Object.assign({ brandId }, { brandName: this.brand.value.brandName });
      this.brandService.update(brand).subscribe(
        response => {
          this.toastrService.success(response.message);
        },
        responseError => {
          this.toastrService.error(responseError.error.message);
        }
      );
    }
  }
}
