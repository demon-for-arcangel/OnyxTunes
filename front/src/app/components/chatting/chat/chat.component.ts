import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageComponent } from '../message/message.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { ChatMessages, MessageUser } from '../../../interfaces/message';
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
  partner?: any; 
  self?: any; 
  chats: { receptorInfo: MessageUser; messages: Message[] }[] = [];

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
    const emisorId = this.self?.id; 
    const receptorId = this.partnerId; 

    if (emisorId !== undefined && receptorId !== undefined) {
        this.chatService.getChats(emisorId, receptorId).subscribe((response: ChatMessages) => {
            if (response.data.executed) {
                const { emisorUser, receptorUser, messages } = response.data.query;

                this.chats = [{
                    receptorInfo: receptorUser, 
                    messages: messages 
                }];
            } else {
                console.error('Error en la ejecución de la consulta:', response.data.errors);
            }
        });
    } else {
        console.error('Emisor ID o Receptor ID no válidos:', emisorId, receptorId);
    }
}
  private getMessages(body: ChatMessages) {
    body.data.query.messages.forEach(message => {
      this.pushMessage(message);
    });
  }

  private pushMessage(message: Message) {
    this.messages.set(message.id, message);
  }

  handleNewMessage(content: any) { 
    if (content.text && content.text.length > 0) {
      this.socketService.sendMessage({ text: content.text }, this.partnerId!);
    }
  }
}