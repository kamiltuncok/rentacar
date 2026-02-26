import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['login']);
    toastrService.info('Sisteme giriş yapmalısınız');
    return false;
  }

  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['']);
  toastrService.error('Bu sayfaya erişim yetkiniz yok');
  return false;
};

// Keep class export for backward compatibility with existing route references
export const AdminGuard = adminGuard;