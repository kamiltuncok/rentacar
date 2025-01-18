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
<<<<<<< HEAD
<<<<<<< HEAD
  updateFormGroup: FormGroup;
  constructor(private brandService:BrandService, private router:ActivatedRoute, private formBuilder:FormBuilder, private toastrService:ToastrService) {}
  brand =new FormGroup({brandName:new FormControl('')});

  ngOnInit(): void {
    this.brandService.getBrandsById( Number(this.router.snapshot.paramMap.get('brandId'))).subscribe((result:any)=>{
      this.brand =new FormGroup({
        brandName:new FormControl(result.data["brandName"], Validators.required),
      });
    });
=======
=======
>>>>>>> 88816fa (location and car component added)
  brand = new FormGroup({
    brandName: new FormControl(null, [Validators.required]),
  });
  constructor(private brandService:BrandService, private router:ActivatedRoute, private formBuilder:FormBuilder, private toastrService:ToastrService) {}
  

  ngOnInit(): void {
    this.brandService.getBrandsById(+(this.router.snapshot.paramMap.get('brandId'))).subscribe((result:any)=>{
      this.brand.patchValue({
       ...result.data[0]
      });
    })
<<<<<<< HEAD
>>>>>>> 88816fa (location and car component added)
=======
>>>>>>> 88816fa (location and car component added)
  }

  UpdataData(){
    if(this.brand.valid){
      let a:any= this.brand.value.brandName;
      let brand:Brand=Object.assign({brandId:Number(this.router.snapshot.paramMap.get('brandId'))},{brandName:a})
      this.brandService.update(brand).subscribe(response=>{
        this.toastrService.success(response.message)
      }, responseError=>{
        this.toastrService.error(responseError.error.message)
      })
    }
  }

}
