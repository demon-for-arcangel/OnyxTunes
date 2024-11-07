export interface Usuario {
    roles?: Rol[];
    nombre?: string;
    email?: string;
    password?: string;
    fecha_nacimiento?: string;
    genero?: string;
    foto_perfil?: string;
}

export interface Rol {
    nombre?: string;
}