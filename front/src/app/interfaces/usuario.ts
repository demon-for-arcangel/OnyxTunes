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
    nombre: string;
}

export interface RolSeleccionado extends Rol {
    selected?: boolean; // Propiedad para manejar la selección
}