export interface WarehouseDoc {
  id: number;
  name: string;
  totalCapacity: number;
  location: string;
  status: boolean;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
  countryId: number;  
}