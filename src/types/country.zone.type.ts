export default interface CountryZonePayload {
    name: string;
    zoneCode?: number | String; // Optional field
    status?: string;
    countries?: any[]; 
  
}