import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface Item {
    key?: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private dbPath = '/products';
    productRef: AngularFireList<Product> = null;

    constructor(private db: AngularFireDatabase) {
        this.productRef = db.list(this.dbPath);
    }

    getProducts(): Observable<Product[]> {
        // return this.productRef.valueChanges();
        return this.productRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            )
        );
    }

    addProduct(product: Product): void {
        this.productRef.push(product);
    }

    updateProduct(key: string, value: any): void {
        this.productRef.update(key, value).catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
    }

    deleteProduct(key: string): void {
        this.productRef.remove(key);
    }
}
