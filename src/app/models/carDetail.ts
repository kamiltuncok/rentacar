import { CarImage } from "./carImage";

export interface CarDetail{
    id: number,
    description:string,
    carId:number,
    brandName:string,
    colorName:string,
<<<<<<< HEAD
=======
    locationName:string,
>>>>>>> 88816fa (location and car component added)
    dailyPrice:number,
    modelYear:string,
    brandId:number,
    colorId:number,
    imagePath:CarImage[],
    returnDATE:Date,
<<<<<<< HEAD
=======
    isRented:boolean,
    fuelName:string,
    gearName:string,
    deposit:number,
>>>>>>> 88816fa (location and car component added)
}