# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Интерфейс карточки продукта

```
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

```

Интерфейс для модели данных карточек

```
export interface IProductsData {
    catalog: IProduct[];
    preview:string | null;
    getProducts(): IProductsData;
	getProduct(productId: string): IProduct;
	addProductToBasket(productId: string): IBasketItem;
    removeProductFromBasket(productId: string, payload: Function | null): void;
}
```

Данные карточки, используемые в корзине

```
export type IBasketItem = Pick<IProduct, '_id' | 'title' | 'price'>;
```

Интерфейс оформление заказа

```
export interface IOrder {
    payment: string;
    address: string;
    email?: string;
    phone?: string;
    total: number;
    items: string[];
}
```
Интерфейс второй формы заказа

```
export interface IContacts{
    email: string;
    phone: string;
}
```
Данные форм ошибок, используемые в первой форме

```
export type FormOrderErrors = Partial<Record<keyof IOrder, string>>;
```

Данные форм ошибок, используемые во второй форме

```
export type FormConactsErrors = Partial<Record<keyof IContacts, string>>;
```

Интерфейс для изменений элементов каталога

```
export interface CatalogChangeEvent{
    catalog: IProduct[];
}
```

Интерфейс результата заказа

```
export interface IOrderResult {
    id: string[];
    total: number;
    error?: string;
}
```

## Архитектура приложения

Код приложения разделен на слои, согласно парадигме MVP:
 -слой представления, отвечает за отображения данных на странице,
 -слой данных, отвечает за хранение и изменение данных, 
 -презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
 - `get` - выполяет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
 - `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные в ендпоинт, переданный как параметр при вызове метода.

#### Класс EventEmitter
 Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
 Основные методы, реализуемые классом, описаны интерфейсом `IEvents`:
  - `on` - подписка на событие,
  - `emit` - инициализация события, 
  - `trigget` - возвращает ф-ию, при вызове которой иницилизируется требуемое в параметрах событие.

#### Класс Component<T>
 Базовый абстрактный класс как инструментарий для работы с DOM в дочерних компонентах

#### Класс Model<T>
 Базовый абстрактный класс, чтобы можно было отличить дочерние от простых объектов с данными
  

### Слой данных

#### Класс ProductsData
Класс отвечает за логику всей работы.\
Конструктор класса принимает инстант брокера событий\
Наследует абстрактный класс Model<T>\
В полях класса хранятся следующие данные:

 - catalog: IProduct[] - массив объектов товаров
 - preview:string | null - id карточки, выбранной для просмотра в модальном окне
 - order: IOrder - заказ товаров
 - contacts: IContacts - данные пользователя, заказывающий товар
 - formOrderErrors: FormOrderErrors 
 - formConactsErrors: FormConactsErrors 

 Также класс предоставляет набор методов для взаимодействия с этими данными.
 - setCatalog(items: IProduct[]) - устанавливает карточки
 - setPreview(item: IProduct) - превью карточки продукта
 - addProductInBasket(item: IProduct) - добавляем товар в корзину
 - getBasket() - получаем продукты в корзине
 - clearBasket() - очищаем все продукты из корзины
 - getTotalPrice() - получаем сумарную стоимость товаров в корзине
 - removeProductFromBasket(item: IProduct) - удаляем товар из корзины
 - setOrderField и setContactsField - устанавливаем значения в формы заказа
 - validateOrder() и validateContacts() - валидация вводимых данных
 - setContactsToOrder() и setItems() - передаем значения введеных данных и item'ы в заказ для отправки
 - clearOrde() - очистка заказа


### Классы представления
Все классы представления отвечают за отображения внутри контейнера (DOM-элемент) передаваемых в них данных. Все классы представления наследуют абстрактный класс Component<T>\

#### Класс ModalUI
Реализует модальное окно. 
- constructor(container: HTMLElement, events: IEvents) Конструктор принимает HTMLElement (который нужно отобразить в модальном окне) и экземпляр класса `EventEmitter` для возможности инициации событий.

Свойства:
- content: HTMLElement - компонент который отображается в модальном окне

Методы:
- open() открыть модальное окно
- close() закрыть модальное окно
- render() отобразить модальное окно в компоненте

#### Класс FormUI
Реализуется форма.
- constructor(container: HTMLFormElement, events: IEvents) Конструктор принимает HTMLFormElement (который нужно отобразить) и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- submitButton: HTMLButtonElement - кнопка подтерждения
- form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- errors: Record<string, HTMLElement> - объект, хранящий все элементы для вывода ошибок под полями формы с привязкой к атрибуту name инпутов

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- setInputValues(data: Record<string, string>): void - принимает объект с данными для заполнения полей формы
- setError(data: { field: string, value: string, validInformation: string }): void - принимает объект с данными для отображения или сокрытия текстов ошибок под полями ввода
- showInputError (field: string, errorMessage: string): void - отображает полученный текст ошибки под указанным полем ввода
- hideInputError (field: string): void - очищает текст ошибки под указанным полем ввода
- close (): void - расширяет родительский метод дополнительно при закрытии очищая поля формы и деактивируя кнопку сохранения
- get form: HTMLElement - геттер для получения элемента формы


#### Класс ProductUI
Отвечает за отображение карточки продукта и используется для отображения на странице сайта. В конструктор класса передается DOM-элемент темплейта. Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Методы:
- сеттеры - заполняет атрибуты элементов карточки данными
- геттеры - возвращают необходимые данные карточки

#### Класс BasketUI
Отвечает за отображение корзины.
- constructor(container: HTMLElement, events: IEvents) Конструктор принимает HTMLElement (который нужно отобразить) и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- items - список товаров в корзине
- total - общая стоимость товаров в корзине

#### Класс OrderUI
Отвечает за отображение первой формы заказа и управление им. Класс наследуется от FormUI.

#### Класс ContactsUI
Отвечает за отображение второй формы заказа и управление им. Класс наследуется от FormUI.

#### Класс SuccessUI
Выполняет функцию отображения результата выполнения заказа.
- constructor(container: HTMLElement, events: IEvents) Конструктор принимает HTMLElement (который нужно отобразить).

Поля класса:
- title - заголовок 
- description - описание результата


#### Класс PageUI
Отвечает за отображение главной страницы.
- constructor(container: HTMLElement, events: IEvents) Конструктор принимает HTMLElement (который нужно отобразить) и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса:
- catalog - массив карточек товаров
- counter - счетчик товаров в корзине


### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы, реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\

*Список всех событий, которые могут генерироваться в системе.*\
*События изменения данных*
- ['ITEMS_CHANGED']: 'items:changed' - изменения массива карточек продукта

*События, возникающие при взаимодействие пользователя с интерфейсом*\
- ['CLEAR_ORDER']: 'clear:order',
- ['CONTACTS_SUBMIT']: 'contacts:submit',
- ['ORDER_READY']: 'order:ready',
- ['ORDER_SUBMIT']: 'order:submit',
- ['FORM_ORDER_ERRORS_CHANGE']: 'formOrderErrors:changed',
- ['FORM_CONTACTS_ERRORS_CHANGE']: 'formContactsErrors:changed',
- ['ORDER_OPEN']: 'order:open',
- ['OPEN_PREVIEW']: 'product:open-preview',
- ['CHANGED_PREVIEW']: 'product:changed-preview',
- ['ADD_PRODUCT']: 'card:add-product',
- ['BASKET_OPEN']: 'basket:open',
- ['REMOVE_PRODUCT']: 'card:remove-product',
- ['MODAL_CLOSE']: 'modal:close',
- ['MODAL_OPEN']: 'modal:open',

