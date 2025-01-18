<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 88816fa (location and car component added)
=======

>>>>>>> 88816fa (location and car component added)
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CarService } from 'src/app/services/car.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
<<<<<<< HEAD
<<<<<<< HEAD
  carDetail:CarDetail[]=[]
=======
  carDetail:CarDetail[]=[];
>>>>>>> 88816fa (location and car component added)
=======
  carDetail:CarDetail[]=[];
>>>>>>> 88816fa (location and car component added)
  dataLoaded=false;
  filterText="";

  constructor(private carService:CarService,private activatedRoute:ActivatedRoute,
    private toastrService:ToastrService, private cartService:CartService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
      if(params["brandId"]){
      this.getCarsByBrandId(params["brandId"])
      }
      else if (params["colorId"]) {
        this.getCarsByColorId(params["colorId"]);
      }
<<<<<<< HEAD
<<<<<<< HEAD
=======
      else if (params["locationId"]) {
        this.getCarsByLocationId(params["locationId"]);
      }
>>>>>>> 88816fa (location and car component added)
=======
      else if (params["locationId"]) {
        this.getCarsByLocationId(params["locationId"]);
      }
>>>>>>> 88816fa (location and car component added)
      else{
        this.getCarDetails()
      } 
     })
    
  }


    getCarDetails(){
      this.carService.getCarDetails().subscribe((response=>{
        this.carDetail=response.data
        this.dataLoaded=true
      }))
    }
    getCarsByBrandId(brandId:number) {
      this.carService.getCarsByBrandId(brandId).subscribe(response=>{
       this.carDetail=response.data;
       this.dataLoaded=true;
      });
     }
     getCarsByColorId(colorId:number) {
      this.carService.getCarsByColorId(colorId).subscribe(response=>{
       this.carDetail=response.data;
       this.dataLoaded=true;
      });
     }
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 88816fa (location and car component added)
     getCarsByLocationId(locationId:number) {
      this.carService.getCarsByLocationId(locationId).subscribe(response=>{
       this.carDetail=response.data;
       this.dataLoaded=true;
      });
     }
<<<<<<< HEAD
>>>>>>> 88816fa (location and car component added)
=======
>>>>>>> 88816fa (location and car component added)
     doesntrent(car:CarDetail){
      this.toastrService.error("Şuan Başka Birisine Kiralı",car.description)
   }


<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 88816fa (location and car component added)
=======

>>>>>>> 88816fa (location and car component added)
     
}
