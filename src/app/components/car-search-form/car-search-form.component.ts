import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-car-search-form',
    templateUrl: './car-search-form.component.html',
    styleUrls: ['./car-search-form.component.css'],
    imports: [NgIf, NgClass, FormsModule, NgFor]
})
export class CarSearchFormComponent {
  @Input() alisOfisiOptions: string[] = [];
  @Input() iadeOfisiOptions: string[] = [];
  @Input() customerType: string = 'individual';
  @Input() showCloseButton: boolean = false;
  
  @Output() search = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Output() customerTypeChange = new EventEmitter<string>();

  selectedStartLocation: string = '';
  selectedEndLocation: string = '';
  selectedStartDate: string = '';
  selectedStartTime: string = '';
  selectedEndDate: string = '';
  selectedEndTime: string = '';
  isDifferentReturnOffice: boolean = false;
  uniqueId: string = Math.random().toString(36).substring(2);

  ngOnInit() {
    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);
  
    this.selectedStartDate = today.toISOString().split('T')[0];
    this.selectedEndDate = twoDaysLater.toISOString().split('T')[0];
    this.selectedStartTime = "22:00";
    this.selectedEndTime = "22:00";
  }

  get alisOfisiId(): string {
    return `alisOfisiOptions_${this.uniqueId}`;
  }

  get iadeOfisiId(): string {
    return `iadeOfisiOptions_${this.uniqueId}`;
  }

  setStartLocation(location: string) {
    this.selectedStartLocation = location;
    if (!this.isDifferentReturnOffice) {
      this.selectedEndLocation = location;
    }
  }

  toggleReturnOfficeVisibility(event: any) {
    this.isDifferentReturnOffice = event.target.checked;
  }

  setCustomerType(type: string) {
    this.customerType = type;
    this.customerTypeChange.emit(type);
  }

  onSearch() {
    const searchData = {
      selectedStartLocation: this.selectedStartLocation,
      selectedEndLocation: this.selectedEndLocation,
      selectedStartDate: this.selectedStartDate,
      selectedStartTime: this.selectedStartTime,
      selectedEndDate: this.selectedEndDate,
      selectedEndTime: this.selectedEndTime,
      customerType: this.customerType
    };
    this.search.emit(searchData);
  }

  onClose() {
    this.close.emit();
  }
}