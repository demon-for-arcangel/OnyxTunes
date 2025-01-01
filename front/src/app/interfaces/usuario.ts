export interface Usuario {
  id: number;
  Rol: Rol[];
  nombre: string;
  email: string;
  password: string;
  fecha_nacimiento: string;
  genero: string;
  foto_perfil: string;
  foto?: string;
  rol?: number;
  rolNombre?: string;
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
  nickname?: string; 
  foto_perfil?: string;
  lastLogin?: any;
  connected?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PendingChat extends UserChat {
  pendingCount: number;
}
