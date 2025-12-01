import { z } from "zod";

export const cartItemSchema = z.object({
  product1688Id: z.number().optional(),
  productLocalId: z.string().nullable(),
  productAlibabaId: z.number().nullable(),
  skuId: z.any().optional().nullable(),
  specId: z.string().optional().nullable(),
  quantity: z.number().optional(),
});


export const cartSchema = z.array(cartItemSchema);