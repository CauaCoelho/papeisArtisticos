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
  produto?: {
    id: number;
    nome?: string;
    preco?: number;
    marca?: { id: number; nome: string };
    imagens?: { fid: string }[];
    arquivos?: { fid: string }[];
  };
}
