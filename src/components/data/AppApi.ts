import { Api } from "../base/Api";
import {IOrder, IOrderResult, IProduct, ApiListResponse, IAppApi} from "../../types/index";


export class AppApi extends Api implements IAppApi {
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    /*async getProduct(id: string): Promise<IProduct> {
        const item = await this.get(`/lot/${id}`);
        return item as IProduct;
    }*/

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => item
        );
    }

    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((
            data: ApiListResponse<IProduct>) => data.items
        );
    }


    createOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}
