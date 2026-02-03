export interface PackageI {
  type: "WOODEN_BOX" | "POLITHIN" | "CARTOON" | "PACKING";
  name?: string;
  size?: string;
  weight?: string;
  volume?: string;
  cbm?: string;
  thin?: boolean;
  category?: string;
  episodes?: string;
  metadata?: string;
  price: string;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  image?: string;
}

export interface UpdatePackageRequestDto {
  type?: "WOODEN_BOX" | "POLITHIN" | "CARTOON" | "PACKING";
  name?: string;
  size?: string;
  weight?: string;
  volume?: string;
  cbm?: string;
  thin?: boolean;
  category?: string;
  episodes?: string;
  metadata?: string;
  price?: string;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  image?: string;
}
