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
