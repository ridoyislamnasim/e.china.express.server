// contactPageTypes.ts


export interface CompanyContacts {
  phones: string[];
  email: string;

  businessHourStart: string; // "08:00"
  businessHourEnd: string;   // "18:00"

  emergencyHotlines: string[];

  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube? : string;
}



export interface ContactMessage {
  id:number;
  name: string;
  email: string;
  phone?: string;        // optional
  subject?: string;      // optional
  message: string;
  createdAt: string;     // ISO string timestamp
  isChecked?: boolean;   // optional, default false
}













// export interface TeamMember {
//   fullName: string;
//   initials: string;
//   profilePhoto?: string | null; // null if text-only
//   officeLocation: string;
//   languages: string[];
//   email: string;
//   rating?: number | null; // optional
// }

// export interface BranchLocation {
//   branchName: string;
//   address: string;
//   city: string;
//   country: string;
//   postalCode?: string;
//   primaryPhone: string;
//   secondaryPhone?: string;
//   email: string;
//   weeklyOffDay: string;
//   googleMapsLink?: string;
// }

