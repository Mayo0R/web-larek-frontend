import {ensureElement} from "../../utils/utils";
import {Component} from "../base/Component";

interface ISuccessUI {
	title: string;
	description: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class SuccessUI extends Component<ISuccessUI> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>('.order-success__close',this.container);
		this._description = ensureElement<HTMLElement>('.order-success__description',this.container);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set description(value: number) {
		this._description.textContent = 'Списано ' + (value) + ' синапсов'
	  }
}