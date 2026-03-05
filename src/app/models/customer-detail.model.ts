/**
 * Represents a full customer detail fetched from GET /api/customers/detail/{id}.
 * Covers both Individual and Corporate customers polymorphically.
 */
export interface CustomerDetail {
    id: number;
    phoneNumber: string;
    email: string;
    identityNumber?: string;
    // Individual customer fields
    firstName?: string;
    lastName?: string;
    // Corporate customer fields
    companyName?: string;
    taxNumber?: string;
}

/**
 * Combined user + customer data used in the Profile component.
 */
export interface UserProfile {
    id: number;
    email: string;
    customerId: number;
    status: boolean;
    firstName?: string;
    lastName?: string;
    companyName?: string;
}

/**
 * DTO for updating a user's first/last name — maps to
 * POST /api/users/update-names → UserNamesForUpdateDto (backend).
 */
export interface UserNamesUpdateDto {
    id: number;
    firstName: string;
    lastName: string;
}
