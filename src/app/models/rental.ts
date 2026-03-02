export interface Rental {
    id: number;
    carId: number;
    customerId: number;
    startLocationId: number;
    endLocationId: number;
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

export enum RentalStatus {
    Pending = 0,
    Active = 1,
    Completed = 2,
    Cancelled = 3
}

export enum DepositStatus {
    Blocked = 1,
    Charged = 2,
    Refunded = 3,
    PartiallyRefunded = 4
}

