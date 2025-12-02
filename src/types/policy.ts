export interface PolicyTypeI {
  id: number;
  title: string;
  slug: string;
  created_at: Date;
  updated_at: Date; 
  policies?: PoliciesI[];
}

export interface PoliciesI {
  id: number;
  title: string;
  description?: string | null;
  helpfulCount: number;
  notHelpfulCount: number;
  created_at: Date;
  updated_at: Date; 
  policyTypeId: number;
  policyType?: PolicyTypeI;
}


export interface PolicyRequestDTO {
  id?: number;
  title: string;
  slug: string;
  policyTypeId: number;
  policyTypeTitle: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface CreatePolicyRequestDTO {
  title: string;
  policyTypeId: number;
  description: string;
}



export interface CreatePolicyTypeRequestDTO {
  id: number;
  title: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;

  // Relation: one PolicyType has many Policies
  policies?: String[];

}