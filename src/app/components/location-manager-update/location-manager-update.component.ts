import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocationManagerService } from '../../services/location-manager.service';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location';

@Component({
    selector: 'app-location-manager-update',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './location-manager-update.component.html',
    styleUrls: ['./location-manager-update.component.css']
})
export class LocationManagerUpdateComponent implements OnInit {
    updateForm: FormGroup;
    locations: Location[] = [];
    userId: number;
    oldLocationId: number;

    // Readonly display fields
    managerFirstName: string = '';
    managerLastName: string = '';
    managerEmail: string = '';
    managerPhoneNumber: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private locationManagerService: LocationManagerService,
        private locationService: LocationService,
        private toastrService: ToastrService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.createUpdateForm();
        this.getLocations();

        this.activatedRoute.params.subscribe(params => {
            if (params["id"]) {
                this.userId = parseInt(params["id"]);
                this.updateForm.patchValue({ userId: this.userId });
                this.loadManagerData();
            }
        });
    }

    loadManagerData() {
        this.locationManagerService.getLocationManagers().subscribe(response => {
            const manager = response.data.find(m => m.userId === this.userId);
            if (manager) {
                this.managerFirstName = manager.firstName;
                this.managerLastName = manager.lastName;
                this.managerEmail = manager.email;
                this.managerPhoneNumber = manager.phoneNumber;
                this.updateForm.patchValue({
                    oldLocationId: manager.locationId,
                    newLocationId: manager.locationId
                });
            }
        });
    }

    createUpdateForm() {
        this.updateForm = this.formBuilder.group({
            userId: ["", Validators.required],
            oldLocationId: ["", Validators.required],
            newLocationId: ["", Validators.required]
        });
    }

    getLocations() {
        this.locationService.getLocations().subscribe(response => {
            this.locations = response.data;
        });
    }

    update() {
        if (this.updateForm.valid) {
            let updateModel = Object.assign({}, this.updateForm.value);
            updateModel.oldLocationId = Number(updateModel.oldLocationId);
            updateModel.newLocationId = Number(updateModel.newLocationId);

            this.locationManagerService.updateLocationManager(updateModel).subscribe({
                next: (response) => {
                    this.toastrService.success(response.message, "Success");
                    this.router.navigate(['/location-managers']);
                },
                error: (responseError) => {
                    if (responseError.error?.Errors?.length > 0) {
                        for (let i = 0; i < responseError.error.Errors.length; i++) {
                            this.toastrService.error(responseError.error.Errors[i].ErrorMessage, "Validation Error");
                        }
                    } else {
                        this.toastrService.error(responseError.error.message || "Failed to update manager", "Error");
                    }
                }
            });
        } else {
            this.toastrService.error("Please fill in all required fields properly.", "Warning");
        }
    }

    cancel() {
        this.router.navigate(['/location-managers']);
    }
}
