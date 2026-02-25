import { CarImage } from "./carImage";

export interface CarDetail {
    id: number,
    description: string,
    carId: number,
    brandName: string,
    colorName: string,
    locationName: string,
    dailyPrice: number,
    modelYear: string,
    brandId: number,
    colorId: number,
    imagePath: CarImage[],
    returnDATE: Date,
    isRented: boolean,
    fuelName: string,
    gearName: string,
    segmentName: string,
    deposit: number,
    locationCity: string,
}