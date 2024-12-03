import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { ChatMessages, SendFilesResponse } from '../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }
  url = environment.baseUrl
  chatsUrl = environment.chatsUrl

  getMessages = (partnerId: number) => {
    return this.http.get<ChatMessages>(`${this.url}` + `${this.chatsUrl}` + `/messages/${partnerId}`);
  }

  uploadMessagesFile = (files: File[], partnerId: number) => {
    const formData = new FormData();

    files.forEach((file, index) => formData.append(`file_${index}`, file));

    return this.http.post<SendFilesResponse>(`${this.url}` + `${this.chatsUrl}` + `/messages/files/${partnerId}`, formData);
  }
}