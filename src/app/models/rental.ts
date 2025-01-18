<<<<<<< HEAD
<<<<<<< HEAD
export interface Rental{
    rentalId:number,
    carId:number,
    customerId:number,
    rentDate:Date,
    returnDate:Date
}
=======
=======
>>>>>>> 88816fa (location and car component added)
export interface Rental {
    rentalId: number;
    carId: number;
    customerId: number;
    rentDate: Date;
    returnDate: Date | null;
    startLocation: string;
    endLocation: string;
    isReturned: boolean;
    customerType: CustomerType;
}

export enum CustomerType {
    Individual = 0,
    Corporate = 1
  }

<<<<<<< HEAD
>>>>>>> 88816fa (location and car component added)
=======
>>>>>>> 88816fa (location and car component added)
