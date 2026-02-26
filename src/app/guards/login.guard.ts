import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['login']);
  toastrService.info('Sisteme Giriş Yapmalısınız');
  return false;
};

// Keep class export for backward compatibility with existing route references
export const LoginGuard = loginGuard;
