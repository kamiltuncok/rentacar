import { ToastrService } from 'ngx-toastr';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from './../../models/location';
import { LocationService } from './../../services/location.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  selectedStartLocation: string = '';
  selectedEndLocation: string = '';
  selectedStartDate: string = '';
  selectedStartTime: string = '';
  selectedEndDate: string = '';
  selectedEndTime: string = '';
  alisOfisiOptions: string[] = [];
  iadeOfisiOptions: string[] = [];
  customerType: string = 'individual'; // Varsayılan olarak 'individual' ayarlandı
  isDifferentReturnOffice: boolean = false;
  showAlert: boolean = false; // Uyarı mesajını gösterip gizlemek için
  alertMessage: string = ''; // Uyarı mesajı

  constructor(private locationService: LocationService,
     private router: Router,
     private toastrService: ToastrService,
    ) {}

  ngOnInit(): void {
    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);
  
    this.selectedStartDate = today.toISOString().split('T')[0]; // Bugünün tarihi
    this.selectedEndDate = twoDaysLater.toISOString().split('T')[0]; // 2 gün sonrası

    this.selectedStartTime = "22:00"; // Alış saati
    this.selectedEndTime = "22:00";   // Veriş saati
  
    this.locationService.getLocations().subscribe((response) => {
      if (response.success) {
        this.alisOfisiOptions = response.data.map((location: Location) => location.locationName);
        this.iadeOfisiOptions = response.data.map((location: Location) => location.locationName);
      } else {
        // Handle the error case
      }
    });
  }
  
  setStartLocation(location: string) {
    this.selectedStartLocation = location;
  
    // Eğer checkbox işaretli değilse, iade ofisini teslim alma ofisiyle eşitle
    if (!this.isDifferentReturnOffice) {
      this.selectedEndLocation = location;
    }
  }
  
  toggleReturnOfficeVisibility(event: any) {
    this.isDifferentReturnOffice = event.target.checked; // Checkbox'ın işaretli olup olmadığını kontrol ediyoruz
  }
  
  

  setCustomerType(type: string) {
    this.customerType = type;
  }

  navigateToCarList() {
    const locationName = this.alisOfisiOptions.find((loc) => loc === this.selectedStartLocation);
    const locationEndName = this.iadeOfisiOptions.find((loc) => loc === this.selectedEndLocation);

    if (locationName && locationEndName) {
      const startDate = this.selectedStartDate;
      const startTime = this.selectedStartTime;
      const endDate = this.selectedEndDate;
      const endTime = this.selectedEndTime;

      const startDateTime = new Date(startDate + 'T' + startTime);
      const endDateTime = new Date(endDate + 'T' + endTime);

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

      if (startDateTime < today) {
        this.toastrService.error('Teslim alma tarihi bugünden önce olamaz. Lütfen tarihi kontrol edin.', "Hata");
        return;
      }

      if (startDateTime >= endDateTime) {
        this.toastrService.error('Alış tarihi, iade tarihinden önce olmalıdır. Lütfen tarihi kontrol edin.',"Hata");
        return;
      }

      const dayDifference = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24));

      const queryParams = {
        locationName: locationName,
        locationEndName: locationEndName,
        from: startDate,
        to: endDate,
        gun: dayDifference.toString(),
        startTime: startTime,
        endTime: endTime,
        customerType: this.customerType === 'individual' ? 0 : 1 // customerType ekleniyor
      };

      this.router.navigate(['home/carlist'], { queryParams: queryParams });
    }
    else {
      this.toastrService.error('Lütfen teslim alma ve iade ofisini seçin.', 'Hata');
    }
  }

  isActive(url: string): boolean {
    return this.customerType === url;
  }

}
