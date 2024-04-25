//Интерфейс для работы с карточкой продукта (в т.ч. данными), включая получение данных с сервера

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	inBasket: boolean;
}

// Интерфейс для работы с частью отображения, где дополнительно помимо интерфейса IProduct необходимо показывать индекс (index) товара у корзины, отображать цену (cost) и status для работы с каталогом в корзине

export interface IProductUI<T> extends IProduct {
	index: number;
	status: T;
	cost: string;
}

export interface IOrder {
	payment: string;
	address: string;
	email?: string;
	phone?: string;
	total: number;
	items: string[];
}

export interface IContacts {
	email: string;
	phone: string;
}

export type FormOrderErrors = Partial<Record<keyof IOrder, string>>;
export type FormConactsErrors = Partial<Record<keyof IContacts, string>>;

export interface CatalogChangeEvent {
	catalog: IProduct[];
}

export interface IOrderResult {
	id: string[];
	total: number;
	error?: string;
}

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface IAppApi {
	getProducts: () => Promise<IProduct[]>;
	getProduct: (id: string) => Promise<IProduct>;
	createOrder: (order: IOrder) => Promise<IOrderResult>;
}
