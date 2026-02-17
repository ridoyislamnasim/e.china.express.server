export interface AddressPayload {
  userId: number;
  house?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  recipientName?: string;
  recipientPhone: string;
  address: string;
  defaultAddress?: boolean;
}
