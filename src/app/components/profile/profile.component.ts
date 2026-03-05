import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { switchMap, catchError, EMPTY } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserProfile, UserNamesUpdateDto } from 'src/app/models/customer-detail.model';
import { ResponseModel } from 'src/app/models/responseModel';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {

  // ─── State ────────────────────────────────────────────────────────────────
  readonly user = signal<UserProfile | null>(null);
  readonly dataLoaded = signal(false);

  // ─── Forms ────────────────────────────────────────────────────────────────
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  private readonly destroyRef = takeUntilDestroyed();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private customerService: CustomerService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadUserProfile();
  }

  // ─── Initialization ───────────────────────────────────────────────────────

  private initForms(): void {
    const userId = Number(this.authService.getCurrentUserId);
    this.profileForm = this.formBuilder.group({
      id: [userId],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.passwordForm = this.formBuilder.group({
      userId: [userId],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      repeatNewPassword: ['', Validators.required]
    });
  }

  /**
   * Previously had subscribe-inside-subscribe anti-pattern.
   * Now uses switchMap to flatten the two dependent HTTP calls.
   */
  private loadUserProfile(): void {
    this.userService.getUserById(this.authService.getCurrentUserId).pipe(
      switchMap(userRes => {
        const userData = userRes.data;
        return this.customerService.getCustomerDetailById(userData.customerId).pipe(
          // Build full profile from both responses
          catchError(() => {
            // If customer detail fetch fails, still show partial data
            this.user.set({ ...userData, firstName: undefined, lastName: undefined });
            this.dataLoaded.set(true);
            return EMPTY;
          }),
          // Map customer detail to a full UserProfile
          switchMap(custRes => {
            if (custRes.success && custRes.data) {
              const fullProfile: UserProfile = {
                ...userData,
                firstName: custRes.data.firstName,
                lastName: custRes.data.lastName,
                companyName: custRes.data.companyName
              };
              this.user.set(fullProfile);
              this.profileForm.patchValue({
                firstName: custRes.data.firstName ?? '',
                lastName: custRes.data.lastName ?? ''
              });
            } else {
              this.user.set({ ...userData });
            }
            this.dataLoaded.set(true);
            return EMPTY;
          })
        );
      }),
      catchError(() => {
        this.toastrService.error('Profil yüklenemedi.', 'Hata');
        this.dataLoaded.set(true);
        return EMPTY;
      }),
      this.destroyRef
    ).subscribe();
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  updateUserNames(): void {
    if (!this.profileForm.valid) {
      this.toastrService.error('Lütfen tüm alanları doldurunuz.', 'Hata!');
      return;
    }
    const dto: UserNamesUpdateDto = this.profileForm.value as UserNamesUpdateDto;
    this.userService.updateUserNames(dto).subscribe({
      next: res => {
        this.toastrService.info(res.message, 'Bilgiler Güncellendi.');
        // Push new name into the AuthService signal → navi updates instantly
        this.authService.updateDisplayName(dto.firstName, dto.lastName);
        this.router.navigate(['/home']);
      },
      error: err => this.toastrService.error(err?.error ?? 'Hata oluştu.', 'Hata!')
    });
  }

  updatePassword(): void {
    if (!this.passwordForm.valid) {
      this.toastrService.error('Lütfen tüm alanları doldurunuz.', 'Hata!');
      return;
    }
    const passwordModel = this.passwordForm.value as { userId: number; oldPassword: string; newPassword: string; repeatNewPassword: string };
    this.authService.updatePassword(passwordModel).subscribe({
      next: (res: ResponseModel) => {
        this.toastrService.info(res.message, 'Şifre Güncellendi');
        this.router.navigate(['/home']);
      },
      error: (err: { error?: string }) => this.toastrService.error(err?.error ?? 'Hata oluştu.', 'Hata!')
    });
  }
}
