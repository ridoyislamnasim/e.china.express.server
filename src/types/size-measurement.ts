export interface SizeMeasurementTypeDTO {
  title: string;
  slug?: string;
}

export interface SizeMeasurementTypeI {
  id: number;
  title: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  sizeMeasurements?: SizeMeasurementI[];
}

export interface CreateSizeMeasurementRequestDTO {
  title: string;
  description?: string | null;
  sizeMeasurementTypeId: number;
  id?: number;
}

export interface SizeMeasurementI {
  id: number;
  title: string;
  description?: string | null;
  sizeMeasurementTypeId: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
  sizeMeasurement?: SizeMeasurementTypeI;
}
