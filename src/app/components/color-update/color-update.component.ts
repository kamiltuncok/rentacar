import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/models/color';
import { CarService } from 'src/app/services/car.service';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color-update',
  templateUrl: './color-update.component.html',
  styleUrls: ['./color-update.component.css']
})
export class ColorUpdateComponent implements OnInit {
<<<<<<< HEAD
<<<<<<< HEAD
  updateFormGroup: FormGroup;
  constructor(private colorService:ColorService, private router:ActivatedRoute, private formBuilder:FormBuilder, private toastrService:ToastrService) {}
  color =new FormGroup({colorName:new FormControl('')});

  ngOnInit(): void {
    this.colorService.getColorsById( Number(this.router.snapshot.paramMap.get('colorId'))).subscribe((result:any)=>{
      this.color =new FormGroup({
        colorName:new FormControl(result.data["colorName"], Validators.required),
      });
    });
=======
=======
>>>>>>> 88816fa (location and car component added)
  color = new FormGroup({
    colorName: new FormControl(null, [Validators.required]),
  });
  constructor(private colorService:ColorService, private router:ActivatedRoute, private formBuilder:FormBuilder, private toastrService:ToastrService) {}
  

  ngOnInit(): void {
    this.colorService.getColorsById(+(this.router.snapshot.paramMap.get('colorId'))).subscribe((result:any)=>{
      this.color.patchValue({
       ...result.data[0]
      });
    })
<<<<<<< HEAD
>>>>>>> 88816fa (location and car component added)
=======
>>>>>>> 88816fa (location and car component added)
  }

  UpdataData(){
    if(this.color.valid){
      let a:any= this.color.value.colorName;
      let color:Color=Object.assign({colorId:Number(this.router.snapshot.paramMap.get('colorId'))},{colorName:a})
      this.colorService.update(color).subscribe(response=>{
        this.toastrService.success(response.message)
      }, responseError=>{
        this.toastrService.error(responseError.error.message)
      })
    }
  }
}
