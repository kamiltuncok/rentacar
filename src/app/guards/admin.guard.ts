import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Önce giriş yapılmış mı kontrol et
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["login"]);
      this.toastrService.info("Sisteme giriş yapmalısınız");
      return false;
    }

    // Admin yetkisi kontrol et
    if (this.authService.isAdmin()) {
      return true;
    } else {
      this.router.navigate([""]); // Ana sayfaya yönlendir
      this.toastrService.error("Bu sayfaya erişim yetkiniz yok");
      return false;
    }
  }
}