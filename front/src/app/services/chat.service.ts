import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {
  ChatMessages,
  ReceptorResponse,
  SendFilesResponse,
  Message,
} from "../interfaces/message";
import { PendingChat, UserChat } from "../interfaces/usuario";
import { Observable, fromEvent, Subject } from "rxjs";
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private url = environment.baseUrl;
  private chatsUrl = environment.chatsUrl;
  private socket: Socket;
  private chatSubject = new Subject<PendingChat | UserChat>();

  constructor(private http: HttpClient) {
    this.socket = io(environment.socketUrl); // Conexión al WebSocket
  }

  // === Funciones HTTP ===

  getMessages(emisorId: number, receptorId: number): Observable<ChatMessages> {
    const url = `${this.url}${this.chatsUrl}/mensajes/${emisorId}/${receptorId}`;
    return this.http.get<ChatMessages>(url);
  }

  uploadMessagesFile(
    files: File[],
    partnerId: number,
  ): Observable<SendFilesResponse> {
    const formData = new FormData();
    files.forEach((file, index) => formData.append(`file_${index}`, file));
    return this.http.post<SendFilesResponse>(
      `${this.url}${this.chatsUrl}/messages/files/${partnerId}`,
      formData,
    );
  }

  getPendingChats(): Observable<{
    data: { chats: { pending: PendingChat[]; notPending: UserChat[] } };
  }> {
    return this.http.get<{
      data: { chats: { pending: PendingChat[]; notPending: UserChat[] } };
    }>(`${this.url}${this.chatsUrl}/pending-chats`);
  }

  getMessageByChat(
    emisorId: number,
    receptorId: number,
  ): Observable<ChatMessages> {
    const url = `${this.url}${this.chatsUrl}/mensajes/${emisorId}/${receptorId}`;
    return this.http.get<ChatMessages>(url);
  }

  getChatsByUser(
    usuarioId: number,
  ): Observable<{ success: boolean; chats: UserChat[] }> {
    const url = `${this.url}${this.chatsUrl}/${usuarioId}`;
    return this.http.get<{ success: boolean; chats: UserChat[] }>(url);
  }

  getReceptoresPorEmisor(emisorId: number): Observable<ReceptorResponse> {
    const token = localStorage.getItem("user");
    const headers = new HttpHeaders({
      "x-token": token ? token : "",
    });
    return this.http.get<ReceptorResponse>(
      `${this.url}${this.chatsUrl}/receptores/${emisorId}`,
      { headers },
    );
  }

  // === Funciones WebSocket ===

  connectToChat(emisorId: number, receptorId: number): void {
    const connectionData = { emisorId, receptorId };
    this.socket.emit("joinChat", connectionData);
  }

  sendMessageToSocket(
    message: string,
    emisorId: number,
    receptorId: number,
  ): void {
    const messageData = { emisorId, receptorId, message };
    this.socket.emit("sendMessage", messageData);
  }

  listenForMessages(): Observable<Message> {
    return fromEvent(this.socket, "newMessage");
  }

  listenForDisconnection(): Observable<void> {
    return fromEvent(this.socket, "disconnect");
  }

  joinChat(partnerId: number): void {
    this.socket.emit("unirse-chat", { receptorId: partnerId });
  }

  listenMessages(callback: (message: Message) => void): void {
    this.socket.on("mensaje", callback);
  }

  emitTypingStatus(partnerId: number, typing: boolean): void {
    this.socket.emit("escribiendo", { receptorId: partnerId, typing });
  }

  listenTypingStatus(
    callback: (typingInfo: { userId: number; typing: boolean }) => void,
  ): void {
    this.socket.on("escribiendo", callback);
  }

  leaveChat(emisorId: number, receptorId: number): void {
    const connectionData = { emisorId, receptorId };
    this.socket.emit("leaveChat", connectionData);
  }

  // === Nuevas funciones añadidas ===

  listenForChats(callback: (chat: PendingChat | UserChat) => void): void {
    // Escucha de chats desde el WebSocket y emite a través del Subject
    this.socket.on("newChat", (chat: PendingChat | UserChat) => {
      this.chatSubject.next(chat);
      callback(chat);
    });
  }

  emitChat(chat: PendingChat | UserChat): void {
    // Emitir un nuevo chat al WebSocket
    this.socket.emit("newChat", chat);
    this.chatSubject.next(chat);
  }
}
