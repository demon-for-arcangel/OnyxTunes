import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageComponent } from '../message/message.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { ChatMessages } from '../../../interfaces/message';
import { Message } from '../../../interfaces/message';
import { SocketService } from '../../../services/socket.service';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RouterModule, MessageComponent, MessageInputComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  partnerId?: number;
  messages: Map<number, Message> = new Map();
  partner?: any; // Define el tipo correcto según tu interfaz
  self?: any; // Define el tipo correcto según tu interfaz

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.partnerId = id ? Number(id) : 0;

      if (this.partnerId === 0) {
        console.error('Partner ID no válido:', this.partnerId);
        return;
      }

      this.loadMessages();
      this.socketService.joinChat(this.partnerId!);
    });

    this.socketService.listenMessages((message: Message) => {
      this.pushMessage(message);
    });
  }

  loadMessages() {
    this.chatService.getMessages(this.partnerId!).subscribe(
      (data: ChatMessages) => {
        this.getMessages(data);
      },
      (error) => {
        console.error('Error al cargar los mensajes:', error);
      }
    );
  }

  private getMessages(body: ChatMessages) {
    body.data.query.messages.forEach(message => {
      this.pushMessage(message);
    });
  }

  private pushMessage(message: Message) {
    this.messages.set(message.id, message);
  }

  handleNewMessage(content: any) { // Define el tipo correcto
    if (content.text && content.text.length > 0) {
      this.socketService.sendMessage({ text: content.text }, this.partnerId!);
    }
  }
}