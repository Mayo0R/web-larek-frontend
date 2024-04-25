export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export enum Events {
	['CLEAR_ORDER'] = 'clear:order',
	['CONTACTS_SUBMIT'] = 'contacts:submit',
	['ORDER_READY'] = 'order:ready',
	['ORDER_SUBMIT'] = 'order:submit',
	['FORM_ORDER_ERRORS_CHANGE'] = 'formOrderErrors:changed',
	['FORM_CONTACTS_ERRORS_CHANGE'] = 'formContactsErrors:changed',
	['ORDER_OPEN'] = 'order:open',
	['ITEMS_CHANGED'] = 'items:changed',
	['OPEN_PREVIEW'] = 'product:open-preview',
	['CHANGED_PREVIEW'] = 'product:changed-preview',
	['ADD_PRODUCT'] = 'card:add-product',
	['BASKET_OPEN'] = 'basket:open',
	['REMOVE_PRODUCT'] = 'card:remove-product',
	['MODAL_CLOSE'] = 'modal:close',
	['MODAL_OPEN'] = 'modal:open',
}

export const PRODUCT_CATEGORY: Record<string, string> = {
	['софт-скил']: 'soft',
	['другое']: 'other',
	['кнопка']: 'button',
	['хард-скил']: 'hard',
	['дополнительное']: 'additional',
};
