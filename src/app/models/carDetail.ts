import { CarImage } from './carImage';
import { CarStatus } from './car';

export interface CarDetail {
    id: number;
    description: string;
    brandName: string;
    colorName: string;
    locationName: string;
    locationCity: string;
    dailyPrice: number;
    deposit: number;
    modelYear: number;
    brandId: number;
    colorId: number;
    plateNumber: string;
    km: number;
    status: CarStatus;
    fuelName: string;
    gearName: string;
    segmentName: string;
    imagePath: CarImage[];
}