export interface RentalDetail{
    rentalId:number,
    fullName:string,
    brandName:string,
    carId:number,
    customerId:number,
    rentDate:Date,
<<<<<<< HEAD
    returnDate:Date
=======
    returnDate:Date,
    isReturned: boolean;
    customerType: number;
>>>>>>> 88816fa (location and car component added)
}