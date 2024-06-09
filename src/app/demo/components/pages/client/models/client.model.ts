export interface Client {
    key?: string;
    id?: string;
    logradouro?: string;
    uf?: string;
    nome?: string;
    cep?: any;
    municipio?:any;
    estado?: any;
    telefone?: string;
    cpf?: string;
    sexo?: 'Masculino' | 'Feminino' | 'Outro';
  }
  