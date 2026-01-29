export default interface CarrierCompanyPayload {
  name: string;
  shortName?: string;
  code?: string;
  carrierType?: 'SEA' | 'AIR';

  // Industry Codes
  scacCode?: string;
  iataCode?: string;
  icaoCode?: string;

  logoUrl?: string;
  description?: string;
  status?: boolean;
}