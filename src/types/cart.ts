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

export interface ProductShippingPayload {
            cartId?: number;
            rateId?: number;
            cartProductId?: number;
            userId?: number;
            fromCountryId?: number;
            toCountryId?: number;
            totalQuantity?: number;
            approxWeight?: number;
            weightRange?: string;
            shippingMethodId?: number;
            totalCost?: number;
            customDuty?: number;
            vat?: number;
            handlingFee?: number;
            packagingFee?: number;
            discount?: number;
            finalPayable?: number;
            estDeliveryDays?: number;
            shippingStatus?: string;
        }

export type CartPayload = TCart & { products?: TCartProduct[] };

export interface TPriceRange {
	startQuantity: number;
 	price: string | number;
}

export interface TUnitInfo {
 	unit?: string;
 	transUnit?: string;
}

export interface TFenxiaoSaleInfo {
 	onePieceFreePostage?: boolean;
 	startQuantity?: number;
}

export interface TSaleInfo {
 	amountOnSale?: number;
 	priceRangeList?: TPriceRange[];
 	quoteType?: number;
 	unitInfo?: TUnitInfo;
 	fenxiaoSaleInfo?: TFenxiaoSaleInfo;
}

