export interface ServiceTypeI {
  id: number;
  title: string;
  slug: string;
  created_at?: Date;
  updated_at?: Date; 
  policies?: ServicesI[];
  createdAt ?: Date;
  updatedAt ?:Date;
}

export interface ServicesI {
  id: number;
  title: string;
  description?: string | null;
  helpfulCount: number;
  notHelpfulCount: number;
  created_at?: Date;
  updated_at?: Date; 
  createdAt ?: Date;
  updatedAt ?:Date;
  serviceTypeId: number;
  serviceType?: ServiceTypeI;
}


export interface ServiceRequestDTO {
  id?: number;
  title: string;
  slug: string;
  serviceTypeId: number;
  serviceTypeTitle: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface CreateServiceRequestDTO {
  title: string;
  slug?: string | undefined;
  serviceTypeId: number;
  description: string;
}



export interface CreateServiceTypeRequestDTO {
  id: number;
  title: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;

  // Relation: one ServiceType has many Services
  policies?: String[];

}