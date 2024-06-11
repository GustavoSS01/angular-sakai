import { Component, OnInit } from '@angular/core';
import { Order } from "./models/order.model";
import { OrderService } from "./services/order.service";
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ClientService } from '../client/services/client.service';
import { ProductService } from '../product/services/product.service';

import { Client } from '../client/models/client.model'
import { Product } from '../product/models/product.model'

@Component({
    templateUrl: './order.component.html',
    providers: [MessageService]
})
export class OrderComponent implements OnInit {

    orderDialog: boolean = false;

    deleteOrderDialog: boolean = false;

    deleteOrdersDialog: boolean = false;

    orders: Order[] = [];

    order: Order = {};

    clients: Client = {};

    products: Product = {};

    selectedOrders: Order[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private orderService: OrderService, private messageService: MessageService, private clientService: ClientService, private productService:ProductService) { }

    ngOnInit() {

        this.clientService.getClients().subscribe((clients: any)=>{
            this.clients = clients
        })

        this.productService.getProducts().subscribe((products: any)=>{
            this.products = products
        })

        this.orderService.getOrders().subscribe((orders: any)=>{
            this.orders = orders
            console.log(orders)
        });

        this.cols = [
            { field: 'cliente', header: 'Cliente' },
            { field: 'produto', header: 'Produto' },
            { field: 'total', header: 'Total' },
            { field: 'data', header: 'Data' },
        ];
    }


    openNew() {
        this.order = {};
        this.submitted = false;
        this.orderDialog = true;
    }

    deleteSelectedOrders() {
        this.deleteOrdersDialog = true;
    }

    editOrder(order: Order) {
        this.order = { ...order };
        this.orderDialog = true;
    }

    deleteOrder(order: Order) {
        this.deleteOrderDialog = true;
        // this.order = { ...order };
        this.orderService.deleteOrder(order.key);
        
        this.confirmDelete();

    }

    confirmDeleteSelected() {
        this.deleteOrdersDialog = false;
        // this.orders = this.orders.filter(val => !this.selectedOrders.includes(val));
        this.selectedOrders.forEach(order => {
            this.orderService.deleteOrder(order.key);
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Orders Deleted', life: 3000 });
        this.selectedOrders = [];
    }

    confirmDelete() {
        this.deleteOrderDialog = false;
        // this.orders = this.orders.filter(val => val.id !== this.order.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Deleted', life: 3000 });
        this.order = {};
    }

    hideDialog() {
        this.orderDialog = false;
        this.submitted = false;
    }

    saveOrder() {
        this.submitted = true;

        if (this.order.client.nome?.trim()) {
            if (this.order.key) {
                // this.orders[this.findIndexById(this.order.id)] = this.order;
                this.orderService.updateOrder(this.order.key, this.order);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Updated', life: 3000 });
            } else {
                this.order.key = this.createId();
                this.order.code = this.createId();
                // this.orders.push(this.order);
                this.orderService.addOrder(this.order);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Created', life: 3000 });
            }

            this.orders = [...this.orders];
            this.orderDialog = false;
            this.order = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.orders.length; i++) {
            if (this.orders[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}