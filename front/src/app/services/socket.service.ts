import { Injectable } from '@angular/core';
import { io, Socket } from "socket.io-client";
import { environment } from '../../environments/environment';
import { SendMessageSocketParams } from '../interfaces/message';
import { UserChat } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket?: Socket;

  constructor() { }

  connect(token: string) { 
    if (token) {
      this.socket = io(environment.socketUrl, { extraHeaders: { token: token } });
      this.socket.on('connect', () => console.log('Conectado al Websocket de la API'));
    } else {
      throw new Error('Socket token not exists');
    }
  }

  onDisconnect = (callback: Function) => {
    callback();
  }

  sendMessage = (content: SendMessageSocketParams, idToSend: number) => {
    this.socket?.emit('msg', { content, idToSend });
  }

  joinChat = (receptorId: number) => {
    this.socket?.emit('join-chat', { receptorId });
  }

  sendLeavingChat = (receptorId: number) => {
    this.socket?.emit('leave-chat', { receptorId });
  }

  listenNewMessages = (callback: Function) => {
    this.socket?.on('new-message', (params) => callback(params));
  }

  sendMessageRead = (receptorId: number) => {
    this.socket?.emit('message-read', { receptorId });
  }

  listenMessages = (callback: Function) => {
    this.socket?.on('msg', (params) => callback(params));
  }

  listenFileMessages = (callback: Function) => {
    this.socket?.on('msg-file', (params) => callback(params));
  }

  listenUserConnected = (callback: Function) => {
    this.socket?.on('user-connected', (params) => callback(params));
  }

  listenFriendConnected = (callback: Function) => {
    this.socket?.on('friend-connected', (params) => callback(params));
  }

  listenFriendDisconnected = (callback: Function) => {
    this.socket?.on('friend-disconnected', (params) => callback(params));
  }

  listenUsersDisconnected = (callback: Function) => {
    this.socket?.on('user-disconnected', (params) => callback(params));
  }

  listenJoinChat = (callback: Function) => {
    this.socket?.on('join-chat', (params) => callback(params));
  }

  listenReadMessages = (callback: Function) => {
    this.socket?.on('message-read', (params) => callback(params));
  }

  sendNewMatch = (user: UserChat) => {
    this.socket?.emit('new-match', { targetId: user.id });
  }

  listenNewMatch = (callback: Function) => {
    this.socket?.on('new-match', (params) => callback(params));
  }

  removeAllListeners = () => {
    this.socket?.removeAllListeners();
  }
}
