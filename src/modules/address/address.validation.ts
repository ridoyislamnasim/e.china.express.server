import z from "zod";

export const createAddressSchema = z.object({
  userId: z.number().int().positive({ message: "User Id is required" }),
  house: z.string().min(1, { message: "House is required" }),
  street: z.string().min(1, { message: "Street is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  zipCode: z.string().min(1, { message: "Zip code is required" }),
  recipientName: z.string().min(1, { message: "Recipient Name is required" }),
  recipientPhone: z.string().min(1, { message: "Recipient Phone is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  defaultAddress: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();
