export interface TCart {
	userId: number;
	totalPrice?: number | null;
	totalWeight?: number | null;
	currency?: string;
	status?: string;
}

export interface TCartProduct {
	cartId?: number;
	productFor?: 'FROM1688' | 'LOCAL' | 'ALIBABA';
	product1688Id?: string | null;
	productLocalId?: number | null;
	productAlibabaId?: string | null;
	mainSkuImageUrl?: string | null;
	vendorId?: number | null;
	quantity?: number;
	totalPrice?: number | null;
	totalWeight?: number | null;
}


export interface TCartProductVariant {
	cartProductId?: number;
	skuId?: string | null;
	specId?: string | null;
	quantity?: number;
	attributeName?: string | null;
	attributeNameSecond?: string | null;
	weight?: number | null;
	dimensions?: string | null;
	price?: number | null;
	skuImageUrl?: string | null;
	shippingRateId?: number | null;
}

export type CartPayload = TCart & { products?: TCartProduct[] };

