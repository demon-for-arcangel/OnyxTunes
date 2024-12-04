export interface ChatMessages {
  data: {
    errors?: string[]
    executed: boolean,
    query: {
      emisorUser: MessageUser,
      receptorUser: MessageUser,
      messages: Message[]
    }
  }
}

export interface SendFilesResponse {
  data: {
    errors?: string[]
    executed: boolean,
    files: string[]
  }
}

export interface MessageUser {
  id: number
  email: string
  nickname: string
  foto_perfil: string
  connected: boolean
}

export interface Message {
  id: number
  emisor: number
  receptor: number
  texto: string
  leido: boolean
  created_at: string
  updated_at: string
  deleted_at: any
  files?: MessageFile[]
}

export interface FileMessage {
  message: Message,
}

export interface MessageFile {
  file_link: string
}

export interface SendMessageApiParams {
  text?: string,
  files?: File[]
}

export interface SendMessageSocketParams {
  text?: string,
  urls?: string[]
}

export interface NewMessageArgs {
  from: number
}

export interface ReceptorResponse {
  executed: boolean;
  success: boolean;
  data: {
    receptoresConInfo: MessageUser[];
  };
  message?: string; 
}