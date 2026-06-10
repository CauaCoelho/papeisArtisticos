export interface ItemCompra {
  produtoId: number;
  nomeProduto?: string;
  quantidade: number;
  preco: number;
  subtotal?: number;
}

export interface CompraDTOResponse {
  id: number;
  clienteId?: number;
  dataCompra?: string;
  total: number;
  status?: string;
  itens: ItemCompra[];
  enderecoEntrega?: EnderecoDTOResponse;
}

export interface EnderecoDTOResponse {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}
