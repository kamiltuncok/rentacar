import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-loginforcorporate',
  templateUrl: './loginforcorporate.component.html',
  styleUrls: ['./loginforcorporate.component.css'],
  imports: [RouterLink, FormsModule, ReactiveFormsModule]
})
export class LoginforcorporateComponent implements OnInit {
  loginForCorporateForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.loginForCorporateForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForCorporateForm.valid) {
      const loginModel = Object.assign({}, this.loginForCorporateForm.value);

      this.authService.loginForCorporate(loginModel).subscribe({
        next: response => {
          this.toastrService.info(response.message);
          // applyToken stores the token AND updates the currentUser signal,
          // causing the navi to reactively re-render without a page reload.
          this.authService.applyToken(response.data.token);
          this.router.navigate(['/cars']);
        },
        error: err => {
          this.toastrService.error(err.error?.message || 'Giriş başarısız');
        }
      });
    } else {
      this.markFormGroupTouched();
      this.toastrService.warning('Lütfen tüm alanları doğru şekilde doldurun');
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForCorporateForm.controls).forEach(key => {
      const control = this.loginForCorporateForm.get(key);
      control?.markAsTouched();
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}