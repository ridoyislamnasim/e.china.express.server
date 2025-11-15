export default interface CountryPayload {
    name: string;
    warehouseId?: number | null; // Optional field
    status: string;
    isoCode: string;
    ports?: any[]; // Optional field for ports
}