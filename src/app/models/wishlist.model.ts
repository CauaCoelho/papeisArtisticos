export interface WishlistItem {
  id: number;
  produtoId: number;
  nomeProduto: string;
  preco: number;
  imagemUrl?: string;
  marca?: string;
}

export interface WishlistDTOResponse {
  id: number;
  produtoId: number;
  produtoNome: string;
  produtoImagem?: string;
  preco?: number;
  marca?: string;
  produto?: any;
}
