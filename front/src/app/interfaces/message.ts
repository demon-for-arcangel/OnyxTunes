export interface ChatMessages {
  success: boolean;
  mensajes: Message[];
}

export interface SendFilesResponse {
  data: {
    errors?: string[];
    executed: boolean;
    files: string[];
  };
}

export interface MessageUser {
  id: number;
  email: string;
  nickname: string;
  foto_perfil: string;
  connected: boolean;
}

export interface Message {
  id: number;
  emisor: number;
  receptor: number;
  texto: string;
  leido: boolean;
  createdAt: string;
  updatedAt: string;
  emisorUsuario: {
    id: number;
    nombre: string;
    email: string;
  };
  receptorUsuario: {
    id: number;
    nombre: string;
    email: string;
  };
  files: Array<{
    path: string;
  }>;
}

export interface FileMessage {
  message: Message;
}

export interface MessageFile {
  path: string;
}

export interface SendMessageApiParams {
  text?: string;
  files?: File[];
}

export interface SendMessageSocketParams {
  text?: string;
  urls?: string[];
}

export interface NewMessageArgs {
  from: number;
}

export interface ReceptorResponse {
  executed: boolean;
  success: boolean;
  data: {
    receptoresConInfo: MessageUser[];
  };
  message?: string;
}
