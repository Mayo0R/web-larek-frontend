import {FormUI} from "../ui/FormUI";
import {IEvents} from "../base/Events";


export interface IOrderUI {
	address: string;
	payment: string;
  }

export class OrderUI extends FormUI<IOrderUI> {

	 protected _card: HTMLButtonElement;
	 protected _cash: HTMLButtonElement;
   

	 constructor(container: HTMLFormElement, protected events: IEvents) {
	   super(container, events);
   
	   this._card = container.elements.namedItem('card') as HTMLButtonElement;
	   this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
   
	   if (this._cash) {
		 this._cash.addEventListener('click', () => {
		   this._cash.classList.add('button_alt-active')
		   this._card.classList.remove('button_alt-active')
		   this.onInputChange('payment', 'cash')
		 })
	   }
	   if (this._card) {
		 this._card.addEventListener('click', () => {
		   this._card.classList.add('button_alt-active')
		   this._cash.classList.remove('button_alt-active')
		   this.onInputChange('payment', 'card')
		 })
	   }
	 }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
	
	disableAltButtons() {
		this._cash.classList.remove('button_alt-active')
		this._card.classList.remove('button_alt-active')
	  }
   
}