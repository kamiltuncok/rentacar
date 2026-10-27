import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  inject,
  DestroyRef
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
import { switchMap, catchError, EMPTY, tap } from 'rxjs';
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
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private customerService = inject(CustomerService);
  private formBuilder = inject(FormBuilder);
  private toastrService = inject(ToastrService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // ─── State ────────────────────────────────────────────────────────────────
  readonly user = signal<UserProfile | null>(null);
  readonly dataLoaded = signal(false);
  readonly isUpdatingProfile = signal(false);
  readonly isUpdatingPassword = signal(false);

  readonly customerType = this.authService.customerType;
  readonly isAdmin = this.authService.isAdmin;
  readonly isLocationManager = this.authService.isLocationManager;

  // ─── Forms ────────────────────────────────────────────────────────────────
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  ngOnInit(): void {
    this.initForms();
    this.loadUserProfile();
  }

  // ─── Initialization ───────────────────────────────────────────────────────

  private initForms(): void {
    const userId = Number(this.authService.getCurrentUserId);
    this.profileForm = this.formBuilder.group({
      id: [userId],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.passwordForm = this.formBuilder.group({
      userId: [userId],
      oldPassword: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(5)]],
      repeatNewPassword: ['', [Validators.required]]
    });
  }

  private loadUserProfile(): void {
    const userId = Number(this.authService.getCurrentUserId);
    if (!userId || userId <= 0) {
      this.toastrService.warning('Profilinizi görüntülemek için lütfen giriş yapın.', 'Giriş Gerekli');
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserById(userId).pipe(
      switchMap(userRes => {
        const userData: any = (userRes as any)?.data ?? userRes;

        if (!userData || userData.customerId == null) {
          this.user.set(userData ? ({ ...userData } as UserProfile) : null);
          this.dataLoaded.set(true);
          return EMPTY;
        }

        return this.customerService.getCustomerDetailById(userData.customerId).pipe(
          tap(custRes => {
            const custData: any = (custRes as any)?.data ?? custRes;
            if (custData) {
              const fullProfile: UserProfile = {
                ...userData,
                firstName: custData.firstName ?? userData.firstName ?? '',
                lastName: custData.lastName ?? userData.lastName ?? '',
                companyName: custData.companyName ?? ''
              };
              this.user.set(fullProfile);
              this.profileForm.patchValue({
                id: userId,
                firstName: fullProfile.firstName ?? '',
                lastName: fullProfile.lastName ?? ''
              });
            } else {
              this.user.set({ ...userData });
            }
            this.dataLoaded.set(true);
          }),
          catchError(() => {
            this.user.set({ ...userData });
            this.dataLoaded.set(true);
            return EMPTY;
          })
        );
      }),
      catchError(err => {
        console.error('Profil yükleme hatası:', err);
        this.toastrService.error('Profil bilgileri yüklenemedi.', 'Hata');
        this.dataLoaded.set(true);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  // ─── Computed Helpers ─────────────────────────────────────────────────────

  getInitials(): string {
    const u = this.user();
    if (!u) return 'OG';
    const first = u.firstName?.trim()?.charAt(0) || '';
    const last = u.lastName?.trim()?.charAt(0) || '';
    if (first || last) return (first + last).toUpperCase();
    if (u.email) return u.email.charAt(0).toUpperCase();
    return 'OG';
  }

  getRoleLabel(): string {
    if (this.isAdmin()) return 'Sistem Yöneticisi';
    if (this.isLocationManager()) return 'Şube Müdürü';
    if (this.customerType() === 'Corporate') return 'Kurumsal Müşteri';
    return 'Bireysel Müşteri';
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  updateUserNames(): void {
    if (!this.profileForm.valid) {
      this.toastrService.error('Lütfen ad ve soyad alanlarını eksiksiz doldurunuz.', 'Hata!');
      return;
    }

    const userId = Number(this.authService.getCurrentUserId);
    const dto: UserNamesUpdateDto = {
      id: userId,
      firstName: (this.profileForm.value.firstName || '').trim(),
      lastName: (this.profileForm.value.lastName || '').trim()
    };

    this.isUpdatingProfile.set(true);
    this.userService.updateUserNames(dto).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: res => {
        this.isUpdatingProfile.set(false);
        this.toastrService.success(res.message || 'Profil bilgileriniz başarıyla güncellendi.', 'Başarılı');
        this.authService.updateDisplayName(dto.firstName, dto.lastName);
        const current = this.user();
        if (current) {
          this.user.set({
            ...current,
            firstName: dto.firstName,
            lastName: dto.lastName
          });
        }
      },
      error: err => {
        this.isUpdatingProfile.set(false);
        this.toastrService.error(err?.error?.message ?? err?.error ?? 'Bilgiler güncellenirken hata oluştu.', 'Hata!');
      }
    });
  }

  updatePassword(): void {
    if (!this.passwordForm.valid) {
      this.toastrService.error('Lütfen tüm şifre alanlarını eksiksiz doldurunuz.', 'Hata!');
      return;
    }

    const val = this.passwordForm.value;
    if (val.newPassword !== val.repeatNewPassword) {
      this.toastrService.error('Yeni şifreler birbiriyle uyuşmuyor.', 'Hata!');
      return;
    }

    const userId = Number(this.authService.getCurrentUserId);
    const passwordModel = {
      userId: userId,
      oldPassword: val.oldPassword,
      newPassword: val.newPassword,
      repeatNewPassword: val.repeatNewPassword
    };

    this.isUpdatingPassword.set(true);
    this.authService.updatePassword(passwordModel).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res: ResponseModel) => {
        this.isUpdatingPassword.set(false);
        this.toastrService.success(res.message || 'Şifreniz başarıyla güncellendi.', 'Başarılı');
        this.passwordForm.patchValue({
          oldPassword: '',
          newPassword: '',
          repeatNewPassword: ''
        });
      },
      error: err => {
        this.isUpdatingPassword.set(false);
        this.toastrService.error(err?.error?.message ?? err?.error ?? 'Şifre güncellenirken bir hata oluştu.', 'Hata!');
      }
    });
  }
}
