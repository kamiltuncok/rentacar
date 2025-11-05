import { CustomerType } from './rental';
export interface RentalDetail {
    rentalId: number;
    carId: number;
    customerId: number;
    userId: number;
    brandName: string;
    colorName: string;
    segmentName: string;
    fuelName: string;
    gearName: string;
    locationName: string;
    fullName: string;
    modelYear: number;
    dailyPrice: number;
    description: string;
    rentDate: Date;
    returnDate: Date;
    startLocation: string;
    endLocation: string;
    isReturned: boolean;
    deposit: number;
    customerType:CustomerType;
}