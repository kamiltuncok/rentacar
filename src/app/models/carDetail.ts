import { CarImage } from "./carImage";

export interface CarDetail{
    id: number,
    description:string,
    carId:number,
    brandName:string,
    colorName:string,
<<<<<<< HEAD
<<<<<<< HEAD
=======
    locationName:string,
>>>>>>> 88816fa (location and car component added)
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
<<<<<<< HEAD
=======
=======
>>>>>>> 88816fa (location and car component added)
    isRented:boolean,
    fuelName:string,
    gearName:string,
    deposit:number,
<<<<<<< HEAD
>>>>>>> 88816fa (location and car component added)
=======
>>>>>>> 88816fa (location and car component added)
}