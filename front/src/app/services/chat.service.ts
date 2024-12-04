import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { ChatMessages, MessageUser, ReceptorResponse, SendFilesResponse } from '../interfaces/message';
import { UserChat } from '../interfaces/usuario';
import { Observable } from 'rxjs';
import { PendingChat } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl
  chatsUrl = environment.chatsUrl

  getMessages = (partnerId: number) => {
    console.log(partnerId)
    const url = `${this.url}${this.chatsUrl}/messages/${partnerId}`;
    console.log('URL de la solicitud:', url); // Verifica la URL
    return this.http.get<ChatMessages>(url);
  }

  uploadMessagesFile = (files: File[], partnerId: number) => {
    const formData = new FormData();

    files.forEach((file, index) => formData.append(`file_${index}`, file));

    return this.http.post<SendFilesResponse>(`${this.url}` + `${this.chatsUrl}` + `/messages/files/${partnerId}`, formData);
  }

  getPendingChats(): Observable<{ data: { chats: { pending: PendingChat[], notPending: UserChat[] } } }> {
    return this.http.get<{ data: { chats: { pending: PendingChat[], notPending: UserChat[] } } }>(`${this.url}` + `${this.chatsUrl}` + `/pending-chats`);
  }

  getChats(emisorId: number, receptorId: number): Observable<ChatMessages> {
    const body = {
      emisorId: emisorId,
      receptorId: receptorId
    };

    return this.http.post<ChatMessages>(this.url + this.chatsUrl, body); // Cambia a POST y envía el cuerpo
  }


  getReceptoresPorEmisor(emisorId: number): Observable<ReceptorResponse> {
    const token = localStorage.getItem('user'); // Asegúrate de que la clave sea correcta
    const headers = new HttpHeaders({
      'x-token': token ? token : '' // Agregar el token al encabezado x-token
    });

    return this.http.get<ReceptorResponse>(`${this.url}${this.chatsUrl}/receptores/${emisorId}`, { headers });
  }
}