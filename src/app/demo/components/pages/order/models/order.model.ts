import { Product } from "../../product/models/product.model";
import { Client } from "../../client/models/client.model";

export interface Order {
    id?: string;
    key?: string;
    name?: string;
    code?: string;
    client?: Client;
    products?: Product[];
    total?: number;
    date?: string;
}