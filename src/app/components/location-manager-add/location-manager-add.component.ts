import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocationManagerService } from '../../services/location-manager.service';
import { LocationService } from '../../services/location.service';
import { Location } from '../../models/location';

@Component({
    selector: 'app-location-manager-add',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './location-manager-add.component.html',
    styleUrls: ['./location-manager-add.component.css']
})
export class LocationManagerAddComponent implements OnInit {
    addForm: FormGroup;
    locations: Location[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private locationManagerService: LocationManagerService,
        private locationService: LocationService,
        private toastrService: ToastrService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.createAddForm();
        this.getLocations();
    }

    createAddForm() {
        this.addForm = this.formBuilder.group({
            firstName: ["", Validators.required],
            lastName: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            phoneNumber: ["", Validators.required],
            password: ["12345T.r", Validators.required],
            locationId: ["", Validators.required]
        });
    }

    getLocations() {
        this.locationService.getLocations().subscribe(response => {
            this.locations = response.data;
        });
    }

    add() {
        if (this.addForm.valid) {
            let addModel = Object.assign({}, this.addForm.value);
            addModel.locationId = Number(addModel.locationId);
            this.locationManagerService.addLocationManager(addModel).subscribe({
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
                        this.toastrService.error(responseError.error.message || "Failed to add manager", "Error");
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
