import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginforcorporate',
  templateUrl: './loginforcorporate.component.html',
  styleUrls: ['./loginforcorporate.component.css']
})
export class LoginforcorporateComponent {
  loginForCorporateForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private toastrService: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForCorporateForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  login() {
    if (this.loginForCorporateForm.valid) {
      let loginModel = Object.assign({}, this.loginForCorporateForm.value);

      this.authService.loginForCorporate(loginModel).subscribe(response => {
        this.toastrService.info(response.message);
        localStorage.setItem("token", response.data.token);
      }, responseError => {
        this.toastrService.error(responseError.error);
      });
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
