import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { CorporateUser } from './../../models/corporateUser';
import { CustomerType } from './../../models/rental';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
import { CorporateUserService } from 'src/app/services/corporate-user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css'],
  imports: [RouterLink, RouterLinkActive, NgIf]
})
export class NaviComponent implements OnInit {

  user: User | null = null; // Bireysel kullanıcı verisi
  corporateUser: CorporateUser | null = null; // Kurumsal kullanıcı verisi
  dataLoaded = false;
  isCorporate = false;
  displayName: string = ''; // Kullanıcı adı veya şirket adı için eklendi
  isAdmin = false;
  isLocationManager = false;
  isDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private corporateUserService: CorporateUserService,
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

      // ✅ Admin kontrolü
      if (this.authService.isAdmin()) {
        this.userService.getUserById(userId).subscribe(
          (response: { data: User }) => {
            this.user = response.data;
            this.displayName = this.user.firstName;
            this.isAdmin = true;
            this.dataLoaded = true;
          },
          (error: any) => {
            console.error('Admin bilgisi alınamadı:', error);
            this.displayName = "Admin";
            this.isAdmin = true;
            this.dataLoaded = true;
          }
        );
      }
      // ✅ LocationManager kontrolü
      else if (this.authService.isLocationManager()) {
        this.userService.getUserById(userId).subscribe(
          (response: { data: User }) => {
            this.user = response.data;
            this.displayName = this.user.firstName;
            this.isLocationManager = true;
            this.dataLoaded = true;
          },
          (error: any) => {
            console.error('LocationManager bilgisi alınamadı:', error);
            this.displayName = "Lokasyon Yöneticisi";
            this.isLocationManager = true;
            this.dataLoaded = true;
          }
        );
      }
      else if (customerType === 'Individual') {
        this.userService.getUserById(userId).subscribe(
          (response: { data: User }) => {
            this.user = response.data;
            this.displayName = this.user.firstName;
            this.isCorporate = false;
            this.dataLoaded = true;
          },
          (error: any) => {
            console.error('Bireysel kullanıcı bilgisi alınamadı:', error);
          }
        );
      } else if (customerType === 'Corporate') {
        this.corporateUserService.getUserById(userId).subscribe(
          (response: { data: CorporateUser }) => {
            this.corporateUser = response.data;
            this.displayName = this.corporateUser.companyName;
            this.isCorporate = true;
            this.dataLoaded = true;
          },
          (error: any) => {
            console.error('Kurumsal kullanıcı bilgisi alınamadı:', error);
          }
        );
      } else {
        console.error('Geçersiz customerType değeri:', customerType);
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