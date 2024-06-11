import { Product } from "../../product/models/product.model";
import { Client } from "../../client/models/client.model";

export interface Order {
    id?: string;
    key?: string;
    code?: string;
    client?: Client;
    product?: Product;
    total?: number;
    date?: Date;
}