import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css'],
  imports: [RouterLink, RouterLinkActive, NgIf]
})
export class NaviComponent implements OnInit {

  // ─── Auth state: delegate directly to the reactive signals in AuthService ──
  // These are getters that Angular's change detection will evaluate on every
  // check cycle, picking up the latest signal value without a page reload.
  get isAuthenticated(): boolean { return this.authService.isAuthenticated(); }
  get isAdminUser(): boolean { return this.authService.isAdmin(); }
  get isLocManager(): boolean { return this.authService.isLocationManager(); }
  get isCorporate(): boolean { return this.authService.customerType() === 'Corporate'; }

  // ─── Display state ────────────────────────────────────────────────────────
  // Reactive: reads from AuthService.displayName signal — updates instantly
  // when profile calls authService.updateDisplayName()
  get displayName(): string { return this.authService.displayName(); }
  dataLoaded = false;
  isDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDisplayName();
  }

  // Reload display name whenever the component is live and auth state is set.
  private loadDisplayName(): void {
    // displayName is now a signal-backed getter, nothing to load here.
    this.dataLoaded = true;
  }

  logout(): void {
    this.authService.logOut();   // clears token AND sets currentUser signal → null
    this.toastrService.info('Çıkış yapıldı');
    this.router.navigate(['']);
  }

  // ─── Menu visibility helpers (derived from signals via getters) ───────────
  showAdminMenu(): boolean { return this.isAuthenticated && this.isAdminUser; }
  showLocationManagerMenu(): boolean { return this.isAuthenticated && this.isLocManager; }
  showUserMenu(): boolean { return this.isAuthenticated && !this.isAdminUser && !this.isLocManager; }

  getProfileUrl(): string {
    if (this.isAdminUser) return '/admin-profile';
    if (this.isLocManager) return '/location-manager-profile';
    return this.isCorporate ? '/profilecorporate' : '/profile';
  }

  getUserRoleText(): string {
    if (this.isAdminUser) return 'Admin';
    if (this.isLocManager) return 'Lokasyon Yöneticisi';
    return this.isCorporate ? 'Kurumsal' : 'Bireysel';
  }

  // ─── Dropdown ─────────────────────────────────────────────────────────────
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.g-nav__dropdown-wrap')) {
      this.isDropdownOpen = false;
    }
  }
}