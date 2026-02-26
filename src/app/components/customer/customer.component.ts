import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.css'],
    imports: [NgIf, NgFor]
})
export class CustomerComponent implements OnInit  {
  customers:Customer[]= [];
  dataLoaded=false;

   

 constructor(private customerService:CustomerService) {}

  ngOnInit():void {
   this.getCustomers();
  }

  getCustomers() {
   this.customerService.getCustomers().subscribe(response=>{
    this.customers=response.data;
    this.dataLoaded=true;
   });
   
  }
}
