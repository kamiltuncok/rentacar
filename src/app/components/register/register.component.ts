import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder:FormBuilder,private authService:AuthService,
   private toastrService:ToastrService,private router:Router) {}
 
  ngOnInit(): void {
    this.createLoginForm();
  }
   createLoginForm(){
 this.registerForm=this.formBuilder.group({
  firstName:["",Validators.required],
  lastName:["",Validators.required],
   email:["",Validators.required],
   identityNumber:["",Validators.required],
   phoneNumber:["",Validators.required],
   address:["",Validators.required],
   password:["",Validators.required]
 })
   }
   register(){
     if (this.registerForm.valid) {
       let registerModel=Object.assign({}, this.registerForm.value)
 
       this.authService.register(registerModel).subscribe(response => {
         this.toastrService.info("Kayıt Başarılı")
         console.log(response)
       },responseError =>{
         this.toastrService.error(responseError.error)
       })
     }
   }

   isActive(path: string): boolean {
    return this.router.url === path;
  }
}
