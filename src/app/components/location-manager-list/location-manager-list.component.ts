import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocationManagerService } from '../../services/location-manager.service';
import { LocationManager } from '../../models/locationManager';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-location-manager-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './location-manager-list.component.html',
    styleUrls: ['./location-manager-list.component.css']
})
export class LocationManagerListComponent implements OnInit {
    managers: LocationManager[] = [];
    dataLoaded = false;

    constructor(
        private locationManagerService: LocationManagerService,
        private toastrService: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getManagers();
    }

    getManagers() {
        this.locationManagerService.getLocationManagers().subscribe({
            next: (response) => {
                this.managers = response.data;
                this.dataLoaded = true;
            },
            error: (error) => {
                this.toastrService.error("Failed to load location managers", "Error");
            }
        });
    }

    navigateToAdd() {
        this.router.navigate(['/location-managers/add']);
    }

    navigateToEdit(manager: LocationManager) {
        this.router.navigate(['/location-managers/update', manager.userId]);
    }

    revoke(manager: LocationManager) {
        if (confirm(`Are you sure you want to revoke management privileges for ${manager.firstName} ${manager.lastName}?`)) {
            this.locationManagerService.revokeLocationManager(manager.userId, manager.locationId).subscribe({
                next: (response) => {
                    this.toastrService.success(response.message, "Success");
                    this.getManagers();
                },
                error: (error) => {
                    this.toastrService.error(error.error?.message || "Failed to revoke", "Error");
                }
            });
        }
    }
}
