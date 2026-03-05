import { Router, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [RouterLink, FormsModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

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
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const loginModel = Object.assign({}, this.loginForm.value);

      this.authService.login(loginModel).subscribe({
        next: response => {
          this.toastrService.info(response.message);
          // applyToken stores the token AND updates the currentUser signal,
          // causing the navi to reactively re-render without a page reload.
          this.authService.applyToken(response.data.token);
          this.router.navigate(['/home']);
        },
        error: err => this.toastrService.error(err.error)
      });
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
