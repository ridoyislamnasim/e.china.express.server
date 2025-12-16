export interface WarehouseSpacePayload {
  name: string;
  warehouseId: string;
  totalCapacity: number;
  description?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface SpacePayload {
  spaceId: string;
  type: 'AIR' | 'SEA' | 'EXPRESS';
  name: string;
  price?: string;
  duration?: string;
  occupied?: boolean;
  spaceNumber?: number;
  capacity: number;
  notes?: string;
  userId?: string;
}

export interface InventoryPayload {
  type: 'TYPE_X' | 'TYPE_Y' | 'TYPE_Z';
  name?: string;
  description?: string;
  code: string;
  price?: string;
  duration?: string;
  occupied?: boolean;
  spaceNumber?: number;
  capacity: number;
  fixedCbm?: boolean;
  notes?: string;
  userId?: string;
}

export interface WarehouseSpaceFilter {
  page?: number;
  limit?: number;
  warehouseId?: string;
  search?: string;
}

export interface SpaceStats {
  totalSpaces: number;
  occupiedSpaces: number;
  availableSpaces: number;
  totalInventories: number;
  occupiedInventories: number;
  availableInventories: number;
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
}