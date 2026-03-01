import { Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    // ─── Home (eager — landing page) ───
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    },

    // ─── Cars (lazy) ───
    {
        path: 'cars',
        loadComponent: () => import('./components/car/car.component').then(m => m.CarComponent),
    },
    {
        path: 'cars/brand/:brandId',
        loadComponent: () => import('./components/car/car.component').then(m => m.CarComponent),
    },
    {
        path: 'cars/color/:colorId',
        loadComponent: () => import('./components/car/car.component').then(m => m.CarComponent),
    },
    {
        path: 'cars/carDetail/:carId',
        loadComponent: () => import('./components/car-detail/car-detail.component').then(m => m.CarDetailComponent),
    },
    {
        path: 'cars/carDetail/:carId/payment',
        loadComponent: () => import('./components/payment/payment.component').then(m => m.PaymentComponent),
    },
    {
        path: 'carDetail/:carId',
        loadComponent: () => import('./components/car-detail/car-detail.component').then(m => m.CarDetailComponent),
    },
    {
        path: 'carDetail/:carId/payment',
        loadComponent: () => import('./components/payment/payment.component').then(m => m.PaymentComponent),
        canActivate: [LoginGuard],
    },

    // ─── Car List from Home (lazy) ───
    {
        path: 'home/carlist',
        loadComponent: () => import('./components/car-list/car-list.component').then(m => m.CarListComponent),
    },
    {
        path: 'home/carlist/payment/:carId',
        loadComponent: () => import('./components/payment/payment.component').then(m => m.PaymentComponent),
    },


    // ─── Rentals (lazy, auth required) ───
    {
        path: 'rentals',
        loadComponent: () => import('./components/rental/rental.component').then(m => m.RentalComponent),
        canActivate: [LoginGuard],
    },
    {
        path: 'location-rentals',
        loadComponent: () => import('./components/location-manager-rentals/location-manager-rentals.component').then(m => m.LocationManagerRentalsComponent),
        canActivate: [LoginGuard],
    },

    // ─── Admin (lazy, admin required) ───
    {
        path: 'cars/add',
        loadComponent: () => import('./components/car-add/car-add.component').then(m => m.CarAddComponent),
        canActivate: [AdminGuard],
    },
    {
        path: 'cars/update/:id',
        loadComponent: () => import('./components/car-update/car-update.component').then(m => m.CarUpdateComponent),
    },
    {
        path: 'brands/add',
        loadComponent: () => import('./components/brand-add/brand-add.component').then(m => m.BrandAddComponent),
        canActivate: [AdminGuard],
    },
    {
        path: 'brands/update/:brandId',
        loadComponent: () => import('./components/brand-update/brand-update.component').then(m => m.BrandUpdateComponent),
    },
    {
        path: 'colors/add',
        loadComponent: () => import('./components/color-add/color-add.component').then(m => m.ColorAddComponent),
        canActivate: [AdminGuard],
    },
    {
        path: 'colors/update/:colorId',
        loadComponent: () => import('./components/color-update/color-update.component').then(m => m.ColorUpdateComponent),
    },
    {
        path: 'carimages/add',
        loadComponent: () => import('./components/car-image-add/car-image-add.component').then(m => m.CarImageAddComponent),
        canActivate: [AdminGuard],
    },
    {
        path: 'locations/add',
        loadComponent: () => import('./components/location-add/location-add.component').then(m => m.LocationAddComponent),
        canActivate: [AdminGuard],
    },

    // ─── Auth (lazy) ───
    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'loginforcorporate',
        loadComponent: () => import('./components/loginforcorporate/loginforcorporate.component').then(m => m.LoginforcorporateComponent),
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
    },
    {
        path: 'registerforcorporate',
        loadComponent: () => import('./components/registerforcorporate/registerforcorporate.component').then(m => m.RegisterforcorporateComponent),
    },
    {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [LoginGuard],
    },
    {
        path: 'location-manager-profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [LoginGuard],
    },

    // ─── Branches (lazy) ───
    {
        path: 'branches',
        loadComponent: () => import('./components/branches/branches.component').then(m => m.BranchesComponent),
    },

    // ─── Location Managers (lazy) ───
    {
        path: 'location-managers',
        loadComponent: () => import('./components/location-manager-list/location-manager-list.component').then(m => m.LocationManagerListComponent),
        canActivate: [AdminGuard],
    },
    {
        path: 'location-managers/add',
        loadComponent: () => import('./components/location-manager-add/location-manager-add.component').then(m => m.LocationManagerAddComponent),
        canActivate: [AdminGuard],
    },
    {
        path: 'location-managers/update/:id',
        loadComponent: () => import('./components/location-manager-update/location-manager-update.component').then(m => m.LocationManagerUpdateComponent),
        canActivate: [AdminGuard],
    },
];
