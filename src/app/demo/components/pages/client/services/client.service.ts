import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map, Observable } from 'rxjs';
import { Client } from '../models/client.model';

export interface Item {
    key?: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private dbPath = '/clients';
    clientRef: AngularFireList<Client> = null;

    constructor(private db: AngularFireDatabase) {
        this.clientRef = db.list(this.dbPath);
    }

    getClients(): Observable<Client[]> {
        // return this.clientRef.valueChanges();
        return this.clientRef.snapshotChanges().pipe(
            map(changes =>
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            )
        );
    }

    addClient(client: Client): void {
        this.clientRef.push(client);
    }

    updateClient(key: string, value: any): void {
        this.clientRef.update(key, value).catch(error => this.handleError(error));
    }

    private handleError(error) {
        console.log(error);
    }

    deleteClient(key: string): void {
        this.clientRef.remove(key);
    }
}
