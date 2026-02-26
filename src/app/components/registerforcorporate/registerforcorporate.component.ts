import { Router, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-registerforcorporate',
    templateUrl: './registerforcorporate.component.html',
    styleUrls: ['./registerforcorporate.component.css'],
    imports: [RouterLink, FormsModule, ReactiveFormsModule]
})
export class RegisterforcorporateComponent implements OnInit {
  registerCorporateForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private toastrService: ToastrService,
    private router:Router) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerCorporateForm = this.formBuilder.group({
      companyName: ["", Validators.required],
      taxNumber: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", [Validators.required, Validators.maxLength(11)]],
      address: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  register() {
    if (this.registerCorporateForm.valid) {
      let registerModel = Object.assign({}, this.registerCorporateForm.value);

      this.authService.registerForCorporate(registerModel).subscribe(response => {
        this.toastrService.success("Kayıt Başarılı");
      }, responseError => {
        this.toastrService.error(responseError.error);
      });
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
