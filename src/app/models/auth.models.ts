export interface LoginPayload {
    login: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    tipo: string;
}

export interface Perfil {
    id: number;
    nome: string;
}

export interface Usuario {
    id: number;
    nome: string;
    username: string;
    perfil: Perfil;
}
