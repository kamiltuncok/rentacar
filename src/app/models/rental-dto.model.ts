/**
 * DTO for creating a rental for an authenticated user.
 * Maps to POST /api/rentals/create
 */
export interface RentalCreateRequestDto {
    carId: number;
    startLocationId: number;
    endLocationId: number;
    startDate: string;
    endDate: string;
}

/**
 * DTO for creating a guest rental (no account required).
 * Maps to POST /api/rentals/createguest
 */
export interface GuestRentalCreateRequestDto extends RentalCreateRequestDto {
    firstName?: string;
    lastName?: string;
    identityNumber?: string;
    email: string;
    phoneNumber?: string;
    companyName?: string;
    taxNumber?: string;
}

/**
 * Response from the create rental / createguest endpoints.
 */
export interface RentalResponseDto {
    rentalId: number;
    totalPrice: number;
}

/**
 * Filter DTO for car availability search.
 * Maps to POST /api/cars/available
 */
export interface CarAvailabilityFilterDto {
    startLocationId: number;
    endLocationId: number;
    startDate: string;
    endDate: string;
    fuelIds?: number[];
    gearIds?: number[];
    segmentIds?: number[];
}
