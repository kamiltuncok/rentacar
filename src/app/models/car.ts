export interface Car {
    id: number;
    description: string;
    brandId: number;
    colorId: number;
    currentLocationId: number;
    dailyPrice: number;
    deposit: number;
    modelYear: number;
    plateNumber: string;
    km: number;
    status: CarStatus;
    fuelId: number;
    gearId: number;
    segmentId: number;
}

export enum CarStatus {
    Available = 0,
    Rented = 1,
    Maintenance = 2,
    Reserved = 3
}