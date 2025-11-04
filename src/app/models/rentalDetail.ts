export interface RentalDetail{
    rentalId:number,
    fullName:string,
    brandName:string,
    carId:number,
    userId:number,
    customerId:number,
    rentDate:Date,
    returnDate:Date,
    isReturned: boolean;
    customerType: number;
}