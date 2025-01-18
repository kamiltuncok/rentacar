<<<<<<< HEAD
<<<<<<< HEAD
import { Component } from '@angular/core';
=======
=======
>>>>>>> 88816fa (location and car component added)
import { CustomerType } from './../../models/rental';
import { CorporateUser } from './../../models/corporateUser';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
import { CorporateUserService } from 'src/app/services/corporate-user.service';
<<<<<<< HEAD
>>>>>>> 88816fa (location and car component added)
=======
>>>>>>> 88816fa (location and car component added)

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css']
})
<<<<<<< HEAD
<<<<<<< HEAD
export class NaviComponent {

=======
=======
>>>>>>> 88816fa (location and car component added)
export class NaviComponent implements OnInit {

  user: User | null = null; // Bireysel kullanıcı verisi
  corporateUser: CorporateUser | null = null; // Kurumsal kullanıcı verisi
  dataLoaded = false;
  isCorporate = false;
  displayName: string = ''; // Kullanıcı adı veya şirket adı için eklendi

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private corporateUserService: CorporateUserService,
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private router: Router,
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
      const customerType = this.authService.getCustomerType(); // Burada getCustomerType() metodunu çağırıyoruz
  
      // CustomerType kontrolü yap
      if (customerType === 'Individual') {
        // Bireysel kullanıcı verisini al
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
        // Kurumsal kullanıcı verisini al
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
  
  
  

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  getProfileUrl(): string {
    return this.isCorporate ? '/profilecorporate' : '/profile';
  }
<<<<<<< HEAD
>>>>>>> 88816fa (location and car component added)
=======
>>>>>>> 88816fa (location and car component added)
}
