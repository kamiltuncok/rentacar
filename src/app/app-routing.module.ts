import { AdminGuard } from './guards/admin.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BranchesComponent } from './components/branches/branches.component';
import { RegisterforcorporateComponent } from './components/registerforcorporate/registerforcorporate.component';
import { PaymentcorporateComponent } from './components/paymentcorporate/paymentcorporate.component';
import { LoginforcorporateComponent } from './components/loginforcorporate/loginforcorporate.component';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarImageAddComponent } from './components/car-image-add/car-image-add.component';
import { HomeComponent } from './components/home/home.component';
import { BrandAddComponent } from './components/brand-add/brand-add.component';
import { BrandUpdateComponent } from './components/brand-update/brand-update.component';
import { CarAddComponent } from './components/car-add/car-add.component';
import { CarDetailComponent } from './components/car-detail/car-detail.component';
import { CarUpdateComponent } from './components/car-update/car-update.component';
import { CarComponent } from './components/car/car.component';
import { ColorAddComponent } from './components/color-add/color-add.component';
import { ColorUpdateComponent } from './components/color-update/color-update.component';
import { PaymentComponent } from './components/payment/payment.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: "", pathMatch: "full", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "home/carlist", component: CarListComponent },
  { path: "home/carlist/payment/:carId", component: PaymentComponent },
  { path: "home/carlist/paymentcorporate/:carId", component: PaymentcorporateComponent },

  { path: "cars", component: CarComponent },
  { path: "cars/brand/:brandId", component: CarComponent },
  { path: "cars/color/:colorId", component: CarComponent },
  { path: "cars/carDetail/:carId", component: CarDetailComponent },
  { path: "cars/carDetail/:carId/payment", component: PaymentComponent },

  { path: "carDetail/:carId", component: CarDetailComponent },
  { path: "carDetail/:carId/payment", component: PaymentComponent, canActivate: [LoginGuard] },

  { path: "cars/add", component: CarAddComponent, canActivate: [AdminGuard] },
  { path: "cars/update/:id", component: CarUpdateComponent },
  { path: "brands/add", component: BrandAddComponent, canActivate: [AdminGuard] },
  { path: "brands/update/:brandId", component: BrandUpdateComponent },
  { path: "colors/add", component: ColorAddComponent, canActivate: [AdminGuard] },
  { path: "colors/update/:colorId", component: ColorUpdateComponent },
  { path: "carimages/add", component: CarImageAddComponent, canActivate: [AdminGuard] },

  { path: "login", component: LoginComponent },
  { path: "loginforcorporate", component: LoginforcorporateComponent },
  { path: "register", component: RegisterComponent },
  { path: "registerforcorporate", component: RegisterforcorporateComponent },
  { path: "profile", component: ProfileComponent, canActivate: [LoginGuard] },
  { path: "branches", component: BranchesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
