import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
=======
import { FormControl, FormGroup, Validators } from '@angular/forms';
>>>>>>> 88816fa (location and car component added)
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CarService } from 'src/app/services/car.service';

@Component({
  selector: 'app-car-update',
  templateUrl: './car-update.component.html',
<<<<<<< HEAD
  styleUrls: ['./car-update.component.css']
})
export class CarUpdateComponent implements OnInit {
  updateFormGroup: FormGroup;
  constructor(private carService: CarService, private router:ActivatedRoute, private formBuilder: FormBuilder, private toastrService:ToastrService) {}
    car =new FormGroup({
    brandId:new FormControl(''),
    colorId:new FormControl(''),
    modelYear:new FormControl(''),
    dailyPrice:new FormControl(''),
    description:new FormControl(''),
  });

  ngOnInit(): void {
   this.carService.getCarsById( Number(this.router.snapshot.paramMap.get('id'))).subscribe((result:any)=>{
      this.car =new FormGroup({
        brandId:new FormControl(result.data["brandId"], Validators.required),
        colorId:new FormControl(result.data["colorId"], Validators.required),
        modelYear:new FormControl(result.data["modelYear"], Validators.required),
        dailyPrice:new FormControl(result.data["dailyPrice"], Validators.required),
        description:new FormControl(result.data["description"], Validators.required),
      });
    });
  }
  
  UpdateData(){
   if(this.car.valid){
      let bI:any= this.car.value.brandId;
      let cI:any= this.car.value.colorId;
      let mY:any= this.car.value.modelYear;
      let dP:any= this.car.value.dailyPrice;
      let d:any= this.car.value.description;

      let car:CarDetail=Object.assign({id:Number(this.router.snapshot.paramMap.get('id'))},
      {brandId:bI},{colorId:cI},{modelYear:mY},{dailyPrice:dP},{description:d})

      this.carService.update(car).subscribe(response=>{
        this.toastrService.success(response.message)
      }, responseError=>{
        this.toastrService.error(responseError.error)
      })
    }
  }
}
=======
  styleUrls: ['./car-update.component.css'],
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
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
  this.carService.getCarsById(+(this.router.snapshot.paramMap.get('id'))).subscribe((result:any)=>{
    this.car.patchValue({
     ...result.data[0]
    });
  })
    
  }

  UpdateData() {
    if (this.car.valid) {
      let bI: any = this.car.value.brandId;
      let cI: any = this.car.value.colorId;
      let mY: any = this.car.value.modelYear;
      let dP: any = this.car.value.dailyPrice;
      let d: any = this.car.value.description;
      let car: CarDetail = Object.assign(
        { id: Number(this.router.snapshot.paramMap.get('id')) },
        { brandId: bI },
        { colorId: cI },
        { modelYear: mY },
        { dailyPrice: dP },
        { description: d }
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
>>>>>>> 88816fa (location and car component added)
