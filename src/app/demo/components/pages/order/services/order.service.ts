import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private dbPath = '/orders';
    orderRef: AngularFireList<Order> = null;

    constructor(private db: AngularFireDatabase) {
        this.orderRef = db.list(this.dbPath);
    }

    getOrders(): Observable<Order[]> {
        // return this.orderRef.valueChanges();
        return this.orderRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            )
        );
    }

    addOrder(order: Order): void {
        this.orderRef.push(order);
    }

    updateOrder(key: string, value: any): void {
        this.orderRef.update(key, value).catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
    }

    deleteOrder(key: string): void {
        this.orderRef.remove(key);
    }
}
