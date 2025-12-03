// types/warehouse.type.ts
export interface WarehousePayload {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  location?: string;
  status?: 'OPERATIONAL' | 'MAINTENANCE' | 'CLOSED' | 'OVERLOADED' | 'UNDER_CONSTRUCTION';
  type?: 'DISTRIBUTION_CENTER' | 'FULFILLMENT_CENTER' | 'COLD_STORAGE' | 'BONDED' | 'RETAIL' | 'MANUFACTURING' | 'CROSS_DOCK';
  totalCapacity: number;
  usedCapacity?: number;
  capacityUnit?: string;
  latitude?: number;
  longitude?: number;
  weekdaysHours?: string;
  weekendsHours?: string;
  holidaysHours?: string;
  lastInspection?: Date;
  nextMaintenance?: Date;
  managerRefId?: number;
  countryId?: number;
  createdBy?: number;
  updatedBy?: number;
}

export interface WarehouseUpdatePayload extends Partial<WarehousePayload> {}

export interface WarehouseFilter {
  status?: string;
  type?: string;
  countryId?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface WarehouseStats {
  totalWarehouses: number;
  operational: number;
  maintenance: number;
  closed: number;
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
}