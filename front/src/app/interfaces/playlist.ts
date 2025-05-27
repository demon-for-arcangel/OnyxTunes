export interface Playlist {
    id: number,
    nombre: string,
    descripcion: string,
    canciones?: Cancion[];
    publico?: boolean;
    portadaURL?: string;
}

export interface Cancion {
    id: number;
    titulo: string;
    artista_id: number;
    duracion: number,
}