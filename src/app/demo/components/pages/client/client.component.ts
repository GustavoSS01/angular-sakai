import { Component, OnInit } from '@angular/core';
import { Client } from './models/client.model'
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ClientService } from './services/client.service';
import { CepService } from './services/cep.service';

@Component({
    templateUrl: './client.component.html',
    providers: [MessageService]
})
export class ClientComponent implements OnInit {

    clientDialog: boolean = false;

    deleteClientDialog: boolean = false;

    deleteClientsDialog: boolean = false;

    clients: Client[] = [];

    client: Client = {};

    selectedClients: Client[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    ufs: any[] = [];

    municipios: any[] = [];

    constructor(private clientService: ClientService, private messageService: MessageService, private cepService: CepService) { }

    ngOnInit() {
        this.cepService.buscarEstados().subscribe((ufs:any[])=>{
            this.ufs = ufs;
        })

        this.clientService.getClients().subscribe((clients: any)=>{
            this.clients = clients
            console.log(clients)
        });

        this.cols = [
            { field: 'client', header: 'Client' },
            { field: 'endereco', header: 'Endereço' },
            { field: 'telefone', header: 'Telefone' },
            { field: 'cpf', header: 'CPF' },
            { field: 'sexo', headed: 'Sexo' }
        ];

    }

    getCep(cep:any){
        this.cepService.buscar(cep).subscribe(
            (cep:any) =>{
                this.client.logradouro = cep.logradouro
                const estadoId = this.ufs.find((estado: any) => estado.sigla == cep.uf);
                this.client.estado = estadoId;
                this.getMunicipios(estadoId.id)
                setTimeout(()=>{
                    const municipioId = this.municipios.find((cidade: any) => cidade.nome == cep.localidade);
                    this.client.municipio =  municipioId
                },500)
            }
        )
    }

    getMunicipios(code:string){
        
        this.cepService.buscarMunicipios(code).subscribe(
            (municipios:any) =>{
                this.municipios = municipios
            }
        )
    }

    testeUF(){
        console.log("municipio",this.client.municipio)
    }

    openNew() {
        this.client = {};
        this.submitted = false;
        this.clientDialog = true;
    }

    deleteSelectedClients() {
        this.deleteClientsDialog = true;
    }

    editClient(client: Client) {
        this.client = { ...client };
        this.clientDialog = true;
    }

    deleteClient(client: Client) {
        this.deleteClientDialog = true;
        // this.client = { ...client };
        this.clientService.deleteClient(client.key);
        this.confirmDelete();

    }

    confirmDeleteSelected() {
        this.deleteClientsDialog = false;
        // this.clients = this.clients.filter(val => !this.selectedClients.includes(val));
        this.selectedClients.forEach(client => {
            this.clientService.deleteClient(client.key);
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Clients Deleted', life: 3000 });
        this.selectedClients = [];
    }

    confirmDelete() {
        this.deleteClientDialog = false;
        // this.clients = this.clients.filter(val => val.id !== this.client.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Deleted', life: 3000 });
        this.client = {};
    }

    hideDialog() {
        this.clientDialog = false;
        this.submitted = false;
    }

    saveClient() {
        this.submitted = true;

        if (this.client.nome?.trim()) {
            if (this.client.id) {
                // @ts-ignore
                // this.clients[this.findIndexById(this.client.id)] = this.client;
                this.clientService.updateClient(this.client.key, this.client);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Updated', life: 3000 });
            } else {
                this.client.id = this.createId();
                // @ts-ignore
                this.client.inventoryStatus = 'INSTOCK';
                // this.clients.push(this.client);
                this.clientService.addClient(this.client);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Client Created', life: 3000 });
            }

            this.clients = [...this.clients];
            this.clientDialog = false;
            this.client = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id === id) {
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
