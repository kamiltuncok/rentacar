import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
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

  user: User | null = null; // Bireysel kullanıcı verisi
  corporateUser: any | null = null; // Kurumsal kullanıcı verisi
  dataLoaded = false;
  isCorporate = false;
  displayName: string = ''; // Kullanıcı adı veya şirket adı için eklendi
  isAdmin = false;
  isLocationManager = false;
  isDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserData();
  }

  logout() {
    this.localStorageService.remove("token");
    window.location.reload();
    this.toastrService.info("Çıkış yapıldı");
    this.router.navigate([""]);
  }

  getUserData() {
    if (this.authService.isAuthenticated()) {
      const userId = this.authService.getCurrentUserId;
      const customerType = this.authService.getCustomerType();

      this.displayName = this.authService.getCurrentUserName;

      this.isAdmin = this.authService.isAdmin();
      this.isLocationManager = this.authService.isLocationManager();
      this.isCorporate = customerType === 'Corporate';

      // Still fetch the actual User reference for legacy bindings if needed
      if (!this.isAdmin && !this.isLocationManager && !this.isCorporate) {
        this.userService.getUserById(userId).subscribe(
          (response) => {
            this.user = response.data;
            this.dataLoaded = true;
          },
          (error) => { this.dataLoaded = true; }
        );
      } else {
        this.dataLoaded = true;
      }
    }
  }

  showAdminMenu(): boolean {
    return this.isAuthenticated() && this.isAdmin;
  }

  showLocationManagerMenu(): boolean {
    return this.isAuthenticated() && this.isLocationManager;
  }

  showUserMenu(): boolean {
    return this.isAuthenticated() && !this.isAdmin && !this.isLocationManager;
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  getProfileUrl(): string {
    if (this.isAdmin) return '/admin-profile';
    if (this.isLocationManager) return '/location-manager-profile';
    return this.isCorporate ? '/profilecorporate' : '/profile';
  }

  getUserRoleText(): string {
    if (this.isAdmin) return 'Admin';
    if (this.isLocationManager) return 'Lokasyon Yöneticisi';
    return this.isCorporate ? 'Kurumsal' : 'Bireysel';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('Dropdown durumu:', this.isDropdownOpen);
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.g-nav__dropdown-wrap')) {
      this.isDropdownOpen = false;
    }
  }
}