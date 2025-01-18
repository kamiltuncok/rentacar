import { Component, OnInit } from '@angular/core';
import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { CarService } from 'src/app/services/car.service';
>>>>>>> 88816fa (location and car component added)
=======
import { CarService } from 'src/app/services/car.service';
>>>>>>> 88816fa (location and car component added)

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent implements OnInit {
  brands:Brand[]= [];
  currentBrand:Brand;
  emptyBrand:Brand;
  filterText="";
   

<<<<<<< HEAD
<<<<<<< HEAD
 constructor(private brandService:BrandService) {}
=======
 constructor(private brandService:BrandService,private carService:CarService) {}
>>>>>>> 88816fa (location and car component added)
=======
 constructor(private brandService:BrandService,private carService:CarService) {}
>>>>>>> 88816fa (location and car component added)

  ngOnInit():void {
   this.getBrands();
  }

  getBrands() {
   this.brandService.getBrands().subscribe(response=>{
    this.brands=response.data;
   });
  }
  setCurrentBrand(brand:Brand){
    this.currentBrand = brand;
  }
  clearCurrentBrand(){
    this.currentBrand = this.emptyBrand
  }
  getCurrentBrandClass(brand:Brand){
    if(brand==this.currentBrand){
      return "list-group-item active";
    }
    else{
      return "list-group-item"
    }
  }
  getAllBrandClass(){
    if(!this.currentBrand)
    {
      return "list-group-item active";
    }
    else{
      return "list-group-item";
    }
  }
<<<<<<< HEAD
<<<<<<< HEAD
=======
  

>>>>>>> 88816fa (location and car component added)
=======
  

>>>>>>> 88816fa (location and car component added)
}
