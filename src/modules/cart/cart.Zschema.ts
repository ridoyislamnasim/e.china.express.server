import { z } from "zod";

export const cartItemSchema = z.object({
  product1688Id: z.number().optional(),
  productLocalId: z.string().nullable(),
  productAlibabaId: z.number().nullable(),
  skuId: z.number(),
  specId: z.string(),
  quantity: z.number(),
});


export const cartSchema = z.array(cartItemSchema);