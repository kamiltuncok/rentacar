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
    Available = 1,
    Rented = 2,
    Maintenance = 3,
    Reserved = 4
}