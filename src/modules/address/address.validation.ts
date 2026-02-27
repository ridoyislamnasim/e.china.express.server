import z from "zod";

export const createAddressSchema = z.object({
  userId: z.number().int().positive({ message: "User Id is required" }),
  house: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  recipientName: z.string().optional(),
  recipientPhone: z.string().min(1, { message: "Recipient Phone is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  defaultAddress: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();
