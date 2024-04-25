import { IProductUI } from '../../types';
import { PRODUCT_CATEGORY } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

export class ProductUI<T> extends Component<IProductUI<T>> {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IProductActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__text`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._category = container.querySelector(`.${blockName}__category`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: keyof typeof PRODUCT_CATEGORY) {
		if (this._category) {
			this.setText(this._category, value);
			const categoryVisual = `card__category_${PRODUCT_CATEGORY[value]}`;
			this._category.classList.add(categoryVisual);
		}
	}

	get category(): keyof typeof PRODUCT_CATEGORY {
		return this._category.textContent as keyof typeof PRODUCT_CATEGORY;
	}

	set cost(value: string | null) {
		this.setText(this._price, value ?? '');
	}

	get cost(): string {
		return this._price.textContent || null;
	}

	set description(value: string | string[]) {
		this.setText(this._description, value);
	}
}

export type CatalogItemStatusInBasket = {
	status: boolean;
};

export class CatalogItem extends ProductUI<CatalogItemStatusInBasket> {
	constructor(container: HTMLElement, actions?: IProductActions) {
		super('card', container, actions);
		this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
	}

	set status({ status }: CatalogItemStatusInBasket) {
		if (this._button) {
			if (this.cost === null) {
				this.setText(this._button, 'Недоступно');
				this._button.disabled = true;
			} else {
				if (!status) {
					this.setText(this._button, 'В корзину');
				} else {
					this.setText(this._button, 'Уже в корзине');
					this._button.disabled = true;
				}
			}
		}
	}
}
