export interface Usuario {
    id: number;
    Rol: Rol[];
    nombre: string;
    email: string;
    password: string;
    fecha_nacimiento: string;
    genero: string;
    foto_perfil: string;
}

export interface Rol {
    id: number;
    nombre: string;
    descripcion?: string; 
    selected?: boolean; 
}

export interface UserChat {
    id?: number;
    email?: string;
    nombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    nickname?: string; // Esta propiedad es importante para mostrar el apodo
    foto_perfil?: string; // Esta propiedad es importante para mostrar la imagen
    lastLogin?: any;
    connected?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PendingChat extends UserChat {
    pendingCount: number; // Esta propiedad es importante para contar los mensajes pendientes
}