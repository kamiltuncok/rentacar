export interface Location {
    id: number;
    locationName: string;
    locationCityId: number;    // FK → LocationCity.Id
    address: string;
    email: string;
    phoneNumber: string;
    latitude: number;
    longitude: number;
}

export interface LocationCity {
    id: number;
    name: string;
}
