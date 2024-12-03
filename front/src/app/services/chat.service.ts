import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { ChatMessages, SendFilesResponse } from '../interfaces/message';
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
}