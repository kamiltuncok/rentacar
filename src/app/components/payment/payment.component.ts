import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CarDetail } from 'src/app/models/carDetail';
import { CartService } from 'src/app/services/cart.service';
import { CarService } from 'src/app/services/car.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  carDetails:CarDetail[]=[];

  carDetail:CarDetail;


  constructor(private activatedRoute:ActivatedRoute,
    private carService:CarService,
    private toastrService:ToastrService,
    private cartService:CartService) {}

  ngOnInit():void {
    this.activatedRoute.params.subscribe(params=> {  
      this.getCarById(params["carId"]);
    })
  }
  getCarById(carId:number){
    this.carService.getCarDetailById(carId).subscribe(response=>{
     this.carDetail=response.data;
    })
  }
  pay(car:CarDetail){
      this.toastrService.success("Araba Kiralandı",car.description)
      this.cartService.pay(car);
   }
}
