import { FormUI } from '../ui/FormUI';
import { IEvents } from '../base/Events';

export interface IContactsUI {
	phone: string;
	email: string;
}

export class ContactsUI extends FormUI<IContactsUI> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
