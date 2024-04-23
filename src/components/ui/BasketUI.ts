import {createElement, ensureElement} from "../../utils/Utils";
import {EventEmitter} from "../base/Events";
import {Component} from "../base/Component";
import {ProductUI, IProductActions} from "../ui/ProductUI"

interface IBasketView {
    items: HTMLElement[];
    total: number;
}


export class BasketUI extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');



        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

  

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.removeAttribute("disabled");
        } else {
            this._button.setAttribute("disabled", "");
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set total(total: number) {
        this.setText(this._total, total.toString() + 'синапсов');
    }
}


export type BasketItemStatus = {
	index: number;
};


export class BasketItem extends ProductUI<BasketItemStatus> {
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductActions) {
		super('card', container, actions);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}
}