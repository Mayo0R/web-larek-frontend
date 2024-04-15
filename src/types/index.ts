export type ProductCategory = 'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое';
export type PaymentType = 'Онлайн' | 'При получении';


export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: ProductCategory;
    price: number | null;
}

export interface IProductsData {
    catalog: IProduct[];
    preview:string | null;
    getProducts(): IProductsData;
	getProduct(productId: string): IProduct;
	addProductToBasket(productId: string): IBasketItem;
    removeProductFromBasket(productId: string, payload: Function | null): void;
}


export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price'>;

export interface IOrderFromBasket {
    items: IBasketItem[];
    totalprice: number | null;
    getBasketItems(): IBasketItem[] | null;
    getBasketItem(basketItemId: string): IBasketItem;
    deleteBasketItem(basketItemId: string, payload: Function | null): void;
    createOrder(order: IOrder):IOrderResult;
    validateOrder(field: keyof IOrder): boolean;
}

export interface IOrder {
    payment: PaymentType;
    adress: string;
    email: string;
    number: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string[];
    total: number;
    error?: string;
}