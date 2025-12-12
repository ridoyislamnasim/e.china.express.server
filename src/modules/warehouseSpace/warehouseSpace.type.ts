export interface WarehouseSpacePayload {
  name: string;
  warehouseId: string;
  totalCapacity: number;
  description?: string;
}

export interface WarehouseSpaceUpdatePayload extends Partial<WarehouseSpacePayload> {}

export interface WarehouseSpaceFilter {
  warehouseId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SubSpaceFilter {
  occupied?: boolean;
}

// Base interface for all space types
interface BaseSpacePayload {
  spaceId: string;
  name: string;
  price?: string;
  duration?: string;
  capacity: number;
  notes?: string;
  spaceNumber?: number;
}

export interface AirSpacePayload extends BaseSpacePayload {
  warehouseSpaceId?: string;
}

export interface SeaSpacePayload extends BaseSpacePayload {
  warehouseSpaceId?: string;
}

export interface ExpressSpacePayload extends BaseSpacePayload {
  warehouseSpaceId?: string;
}

export interface InventoryPayload {
  name?: string;
  description?: string;
  price?: string;
  duration?: string;
  warehouseSpaceId?: string;
}

// Sub-inventory interfaces
export interface SubInventoryXPayload {
  spaceId: string;
  name: string;
  price?: string;
  duration?: string;
  capacity?: number;
  fixedCbm?: boolean;
  notes?: string;
  spaceNumber?: number;
  inventoryId?: string;
}

export interface SubInventoryYPayload {
  spaceId: string;
  name: string;
  price?: string;
  duration?: string;
  capacity?: number;
  fixedCbm?: boolean;
  notes?: string;
  spaceNumber?: number;
  inventoryId?: string;
}

export interface SubInventoryZPayload {
  spaceId: string;
  name: string;
  price?: string;
  duration?: string;
  capacity?: number;
  fixedCbm?: boolean;
  notes?: string;
  spaceNumber?: number;
  inventoryId?: string;
}

// Space stats interface
export interface SpaceStats {
  airSpaces: {
    total: number;
    occupied: number;
    available: number;
  };
  seaSpaces: {
    total: number;
    occupied: number;
    available: number;
  };
  expressSpaces: {
    total: number;
    occupied: number;
    available: number;
  };
  inventory: {
    total: number;
    occupied: number;
    available: number;
  };
  summary: {
    totalSpaces: number;
    occupiedSpaces: number;
    availableSpaces: number;
  };
}