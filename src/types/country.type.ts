export default interface CountryPayload {
    name: string;
    warehouseId?: number | null; // Optional field
    status: string;
    isoCode: string;
    ports?: any[]; // Optional field for ports
    zone?: string; // Optional field for zone
    isShippingCountry?: boolean; // Optional field for shipping country
}