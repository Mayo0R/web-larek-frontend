
export type PaymentType = 'Онлайн' | 'При получении';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    status: boolean;
    inBasket: boolean;
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


export interface IOrder {
    payment: string;
    address: string;
    email?: string;
    phone?: string;
    total: number;
    items: string[];
}

export interface IContacts{
    email: string;
    phone: string;
}

export type FormOrderErrors = Partial<Record<keyof IOrder, string>>;
export type FormConactsErrors = Partial<Record<keyof IContacts, string>>;

export interface CatalogChangeEvent{
    catalog: IProduct[];
}

export interface IOrderResult {
    id: string[];
    total: number;
    error?: string;
}

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export interface IAppApi {
	getProducts: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	createOrder: (order: IOrder) => Promise<IOrderResult>;
}

export const Events = {
	['CLEAR_ORDER']: 'clear:order',
    ['CONTACTS_SUBMIT']: 'contacts:submit',
    ['ORDER_READY']: 'order:ready',
    ['ORDER_SUBMIT']: 'order:submit',
	['FORM_ORDER_ERRORS_CHANGE']: 'formOrderErrors:changed',
    ['FORM_CONTACTS_ERRORS_CHANGE']: 'formContactsErrors:changed',
    ['ORDER_OPEN']: 'order:open',
	['ITEMS_CHANGED']: 'items:changed',
    ['OPEN_PREVIEW']: 'product:open-preview',
    ['CHANGED_PREVIEW']: 'product:changed-preview',
	['ADD_PRODUCT']: 'card:add-product',
    ['BASKET_OPEN']: 'basket:open',
    ['REMOVE_PRODUCT']: 'card:remove-product',
    ['MODAL_CLOSE']: 'modal:close',
    ['MODAL_OPEN']: 'modal:open',
};