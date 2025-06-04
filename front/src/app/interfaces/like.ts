export interface Like {
    id: number;
    usuario_id: number;
    entidad_id: number; 
    entidad_tipo: 'Cancion' | 'Playlist' | 'Album';
}

export interface LikeResponse {
    data?: Like[];
    likes: { cancion_id: number}[];
}