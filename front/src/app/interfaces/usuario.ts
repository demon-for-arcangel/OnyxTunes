export interface Usuario {
    id: number,
    roles: Rol[];
    nombre: string;
    email: string;
    password: string;
    fecha_nacimiento: string;
    genero: string;
    foto_perfil: string;
}

export interface Rol {
    id: number,
    nombre?: string;
    selected?: boolean
}