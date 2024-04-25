import './scss/styles.scss';
import { PageUI } from './components/ui/PageUI';
import { AppApi } from './components/data/AppApi';
import { ProductsData, Product } from './components/data/ProductsData';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder, CatalogChangeEvent, IContacts } from './types/index';
import { Events } from './/./utils/constants';

import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { CatalogItem } from './components/ui/ProductUI';
import { ModalUI } from './components/ui/ModalUI';
import { BasketUI, BasketItem } from './components/ui/BasketUI';
import { OrderUI } from './components/ui/OrderUI';
import { ContactsUI } from './components/ui/ContactsUI';
import { SuccessUI } from './components/ui/SuccessUI';

const events = new EventEmitter();
const api = new AppApi(API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//Модель данных приложения
const appData = new ProductsData({}, events);

//Глобальные контейнеры
const page = new PageUI(document.body, events);
const modal = new ModalUI(
	ensureElement<HTMLElement>('#modal-container'),
	events
);

// Переиспользуемые части интерфейса
const basket = new BasketUI(cloneTemplate(basketTemplate), events);
const order = new OrderUI(cloneTemplate(orderTemplate), events);
const contacts = new ContactsUI(cloneTemplate(contactsTemplate), events);

//Бизнес-логика

//Получаем карточки с сервера
api
	.getProducts()
	.then((cardsList) => {
		console.dir(cardsList);
		appData.setCatalog.bind(appData)(cardsList);
	})
	.catch((err) => {
		console.error(err);
	});

//Изменились элементы каталога
events.on<CatalogChangeEvent>(Events.ITEMS_CHANGED, () => {
	page.catalog = appData.catalog.map((item) => {
		const product = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit(Events.OPEN_PREVIEW, item),
		});

		return product.render({
			title: item.title,
			image: CDN_URL + item.image,
			cost: item.price !== null ? item.price.toString() + ' синапсов' : '',
			category: item.category,
		});
	});
});

// Открытие карточки продукта
events.on(Events.OPEN_PREVIEW, (item: Product) => {
	appData.setPreview(item);
});

// Изменен открытый выбранный товар
events.on(Events.CHANGED_PREVIEW, (item: Product) => {
	const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit(Events.ADD_PRODUCT, item),
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: CDN_URL + item.image,
			description: item.description,
			category: item.category,
			cost: item.price !== null ? item.price?.toString() + ' синапсов' : '',
			status: {
				status: item.inBasket,
			},
		}),
	});
});

// Добавляем товар в корзину
events.on(Events.ADD_PRODUCT, (item: Product) => {
	page.counter = appData.getBasket().length + 1;
	appData.addProductInBasket(item);
	modal.close();
});

// Открытие корзины
events.on(Events.BASKET_OPEN, () => {
	const items = appData.getBasket().map((item, index) => {
		const product = new BasketItem(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit(Events.REMOVE_PRODUCT, item),
		});
		return product.render({
			index: index + 1,
			title: item.title,
			description: item.description,
			cost: item.price?.toString() || '0',
			category: item.category,
		});
	});
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			basket.render({
				items,
				total: appData.getTotalPrice(),
			}),
		]),
	});
});

// Удаляем товар в корзину
events.on(Events.REMOVE_PRODUCT, (item: Product) => {
	page.counter = appData.getBasket().length - 1;
	appData.removeProductFromBasket(item);
});

// Открыть форму заказа Оплаты и Адреса
events.on(Events.ORDER_OPEN, () => {
	modal.render({
		content: order.render({
			address: '',
			payment: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось одно из полей Оплаты и Адреса
events.on(
	/(^order)\..*:change/,
	(data: { field: keyof Omit<IOrder, 'items' | 'total'>; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Изменилось состояние валидации формы Оплаты и Адреса
events.on(Events.FORM_ORDER_ERRORS_CHANGE, (errors: Partial<IOrder>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	``;
});

// Открыть форму заказа E-mail и Телефон
events.on(Events.ORDER_SUBMIT, () => {
	appData.order.total = appData.getTotalPrice();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось одно из полей E-mail и Телефон
events.on(
	/(^contacts)\..*:change/,
	(data: { field: keyof IContacts; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

// Изменилось состояние валидации формы E-mail и Телефон
events.on(Events.FORM_CONTACTS_ERRORS_CHANGE, (errors: Partial<IContacts>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Отправлена форма заказа
events.on(Events.CONTACTS_SUBMIT, () => {
	appData.setContactsToOrder();
	appData.setItems();

	api
		.createOrder(appData.order)
		.then((result) => {
			const success = new SuccessUI(cloneTemplate(successTemplate), {
				onClick: () => {
					events.emit(Events.CLEAR_ORDER);
					modal.close();
				},
			});

			modal.render({
				content: success.render({
					description: result.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			events.emit(Events.CLEAR_ORDER);
		});
});

events.on(Events.CLEAR_ORDER, () => {
	appData.clearOrder();
	appData.clearBasket();
	page.counter = 0;
	order.disableAltButtons();
});

// Блокируем прокрутку страницы, если открыта модалка
events.on(Events.MODAL_OPEN, () => {
	page.locked = true;
});

// Разблокируем страницу
events.on(Events.MODAL_CLOSE, () => {
	page.locked = false;
	appData.clearOrder();
	order.disableAltButtons();
});
