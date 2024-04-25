import { Model } from '../base/Model';
import {
	IOrder,
	IProduct,
	FormOrderErrors,
	IContacts,
	FormConactsErrors,
} from '../../types/index';
import { Events } from './/../../utils/constants';

export class Product extends Model<IProduct> {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	inBasket: boolean;
}

export class ProductsData extends Model<ProductsData> {
	catalog: IProduct[] = [];
	order: IOrder = {
		payment: null as null | string,
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	contacts: IContacts = {
		email: '',
		phone: '',
	};
	preview: string | null;
	formOrderErrors: FormOrderErrors = {};
	formConactsErrors: FormConactsErrors = {};

	//устанавливаем карточки
	setCatalog(items: IProduct[]) {
		this.catalog = items?.map((item) => new Product(item, this.events));
		this.emitChanges(Events.ITEMS_CHANGED, { catalog: this.catalog });
	}

	//превью карточки продукта
	setPreview(item: IProduct) {
		this.preview = item.id;
		this.emitChanges(Events.CHANGED_PREVIEW, item);
	}

	//добавляем товар в корзину
	addProductInBasket(item: IProduct) {
		item.inBasket = true;
		this.emitChanges(Events.ITEMS_CHANGED, { catalog: this.catalog });
	}

	//получаем продукты в корзине
	getBasket() {
		return this.catalog.filter((item) => item.inBasket === true);
	}

	//очищаем все продукты из корзины
	clearBasket() {
		const _filter = this.catalog.filter((item) => item.inBasket === true);
		for (let i = 0; i < _filter.length; i++) {
			_filter[i].inBasket = false;
		}
		return _filter;
	}

	//получаем сумарную стоимость товаров в корзине
	getTotalPrice() {
		const _basket = this.catalog.filter((item) => item.inBasket === true);
		let total = 0;
		for (let i = 0; i < _basket.length; i++) {
			total = total + _basket[i].price;
		}
		return total;
	}

	//удаляем товар из корзины
	removeProductFromBasket(item: IProduct) {
		item.inBasket = false;
		this.emitChanges(Events.BASKET_OPEN, { catalog: this.catalog });
		this.emitChanges(Events.ITEMS_CHANGED, { catalog: this.catalog });
	}

	//устанавливаем значения в первую форму заказа (адрес и способ оплаты)
	setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) {
		this.order[field] = value;
		this.order.phone = '';
		this.order.email = '';
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	//устанавливаем значения во вторую форму заказа (телефон и e-mail)
	setContactsField(field: keyof IContacts, value: string) {
		this.contacts[field] = value;
		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.contacts);
		}
	}

	//валидация вводимых данных в первой форме заказа (адрес и способ оплаты)
	validateOrder() {
		const errors: typeof this.formOrderErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать тип оплаты';
		}

		this.formOrderErrors = errors;
		this.events.emit('formOrderErrors:changed', this.formOrderErrors);
		return Object.keys(errors).length === 0;
	}

	//валидация вводимых данных во второй форме заказа (телефон и e-mail)
	validateContacts() {
		const _errors: typeof this.formConactsErrors = {};
		if (!this.contacts.email) {
			_errors.email = 'Необходимо указать email';
		}
		if (!this.contacts.phone) {
			_errors.phone = 'Необходимо указать телефон';
		}
		this.formConactsErrors = _errors;
		this.events.emit('formContactsErrors:changed', this.formConactsErrors);
		return Object.keys(_errors).length === 0;
	}

	//передаем значения введеных данных из второого поля в наш заказ order
	setContactsToOrder() {
		const _phone = this.contacts.phone;
		const _email = this.contacts.email;
		this.order.phone = _phone;
		this.order.email = _email;
	}

	//передаем items (заказа, который оформляем) в наш заказ order
	setItems() {
		const _filter = this.catalog.filter((item) => item.inBasket === true);
		for (let i = 0; i < _filter.length; i++) {
			this.order.items[i] = _filter[i].id;
		}
		return this.order.items;
	}

	//очистка order
	clearOrder() {
		this.order = {
			payment: null,
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}
}
