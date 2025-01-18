import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarComponent } from './components/car/car.component';
import { BrandComponent } from './components/brand/brand.component';
import { ColorComponent } from './components/color/color.component';
import { CustomerComponent } from './components/customer/customer.component';
import { RentalComponent } from './components/rental/rental.component';
import { NaviComponent } from './components/navi/navi.component';
<<<<<<< HEAD
import { HttpClientModule } from '@angular/common/http';
=======
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
>>>>>>> 88816fa (location and car component added)


import { ToastrModule } from "ngx-toastr";
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { FilterPipePipe } from './pipes/filter-pipe.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarDetailComponent } from './components/car-detail/car-detail.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CarAddComponent } from './components/car-add/car-add.component';
import { BrandAddComponent } from './components/brand-add/brand-add.component';
import { ColorAddComponent } from './components/color-add/color-add.component';
import { CarUpdateComponent } from './components/car-update/car-update.component';
import { ColorUpdateComponent } from './components/color-update/color-update.component';
import { BrandUpdateComponent } from './components/brand-update/brand-update.component';
<<<<<<< HEAD
=======
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { CarImageAddComponent } from './components/car-image-add/car-image-add.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { RegisterforcorporateComponent } from './components/registerforcorporate/registerforcorporate.component';
import { LoginforcorporateComponent } from './components/loginforcorporate/loginforcorporate.component';
import { PaymentcorporateComponent } from './components/paymentcorporate/paymentcorporate.component';
import { BranchesComponent } from './components/branches/branches.component';
>>>>>>> 88816fa (location and car component added)


@NgModule({
  declarations: [
    AppComponent,
    CarComponent,
    BrandComponent,
    ColorComponent,
    CustomerComponent,
    RentalComponent,
    NaviComponent,
    CartSummaryComponent,
    FilterPipePipe,
    CarDetailComponent,
    PaymentComponent,
    CarAddComponent,
    BrandAddComponent,
    ColorAddComponent,
    CarUpdateComponent,
    ColorUpdateComponent,
    BrandUpdateComponent,
<<<<<<< HEAD
=======
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    FooterComponent,
    HomeComponent,
    CarImageAddComponent,
    CarListComponent,
    RegisterforcorporateComponent,
    LoginforcorporateComponent,
    PaymentcorporateComponent,
    BranchesComponent
>>>>>>> 88816fa (location and car component added)

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right"
    }),
<<<<<<< HEAD
=======
  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:AuthInterceptor,multi:true},
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService

>>>>>>> 88816fa (location and car component added)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
