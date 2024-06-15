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

    order: Order = {};  // Aqui está correto

    clients: Client[] = [];  // Deve ser um array de Client
    products: Product[] = [];  // Deve ser um array de Product

    selectedOrders: Order[] = [];

    selectClient: Client | undefined; 

    selectProducts: Product[] = []; 

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private orderService: OrderService, private messageService: MessageService, private clientService: ClientService, private productService:ProductService) { }

    ngOnInit() {

        this.clientService.getClients().subscribe((clients: Client[])=>{
            this.clients = clients
        })

        this.productService.getProducts().subscribe((products: Product[])=>{
            this.products = products
        })

        this.orderService.getOrders().subscribe((orders: Order[])=>{
            this.orders = orders
        });

        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'client', header: 'Cliente' },
            { field: 'products', header: 'Produto' },
            { field: 'total', header: 'Total' },
            { field: 'date', header: 'Data' },
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
        this.selectClient = order.client;
        this.selectProducts = order.products;
        this.orderDialog = true;
    }
    

    deleteOrder(order: Order) {
        this.deleteOrderDialog = true;

        this.orderService.deleteOrder(order.key);

        this.confirmDelete();

    }

    confirmDeleteSelected() {
        this.deleteOrdersDialog = false;

        this.selectedOrders.forEach(order => {
            this.orderService.deleteOrder(order.key);
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Orders Deleted', life: 3000 });
        this.selectedOrders = [];
    }

    confirmDelete() {
        this.deleteOrderDialog = false;

        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Deleted', life: 3000 });
        this.order = {};
    }

    hideDialog() {
        this.orderDialog = false;
        this.submitted = false;
    }

    getProductNames(order: Order): string {
        return order.products?.map(product => product.name).join(', ') || '';
    }

    saveOrder() {
        this.submitted = true;
        if (this.selectClient) {
            if (this.order.key) {
                this.order.client = this.selectClient;
                this.order.products = this.selectProducts;
                this.orderService.updateOrder(this.order.key, this.order);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Updated', life: 3000 });
            } else {
                const newOrder: Order = {
                    key: this.createId(),
                    code: this.createId(),
                    client: this.selectClient,
                    products: this.selectProducts,
                    total: this.order.total,
                    date: this.order.date
                };
                this.orderService.addOrder(newOrder);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Order Created', life: 3000 });
            }

            this.orders = [...this.orders];
            this.orderDialog = false;
            this.order = {};
            this.selectProducts = [];
            this.selectClient = undefined;
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