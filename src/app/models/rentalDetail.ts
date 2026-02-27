import { RentalStatus, DepositStatus } from './rental';

export interface RentalDetail {
    id: number;
    carId: number;
    customerId: number;
    brandName: string;
    colorName: string;
    segmentName: string;
    fuelName: string;
    gearName: string;
    startLocationName: string;
    startLocationCity: string;
    endLocationName: string;
    endLocationCity: string;
    fullName: string;
    email: string;
    modelYear: number;
    plateNumber: string;
    description: string;
    startDate: Date;
    endDate: Date;
    rentedDailyPrice: number;
    totalPrice: number;
    depositAmount: number;
    depositStatus: DepositStatus;
    depositDeductedAmount: number;
    depositRefundedDate: Date | null;
    status: RentalStatus;
}