import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { SocketService } from '../../../services/socket.service';
import { ChatMessages, FileMessage, Message, MessageUser, SendMessageApiParams, SendMessageSocketParams } from '../../../interfaces/message';
import { ChatJoin, MessagesRead } from '../../../interfaces/chat';
import { BrowserModule } from '@angular/platform-browser';
import { AvatarModule } from 'primeng/avatar';
import { MessageComponent } from '../message/message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageInputComponent } from '../message-input/message-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, AvatarModule, MessageComponent, FormsModule, MessageInputComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  providers: []
})
export class ChatComponent {
  constructor(private route: ActivatedRoute, private chatService: ChatService, private socketService: SocketService, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.partnerId = Number(params.get('id')!);
    });

    this.socketService.listenMessages((message: Message) => {
      this.pushMessage(message)
      this.socketService.sendMessageRead(this.partnerId!);
    })

    this.socketService.listenFileMessages((fileMessage: FileMessage) => {
      this.pushMessage(fileMessage.message)
      this.socketService.sendMessageRead(this.partnerId!);
    });

    this.socketService.joinChat(this.partnerId!)
    this.chatService.getMessages(this.partnerId!).subscribe(this.getMessages);

    this.socketService.listenJoinChat((params: ChatJoin) => this.handleJoining(params));
    this.socketService.listenReadMessages((params: MessagesRead) => this.handleMessagesRead(params));

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.socketService.sendLeavingChat(this.receptor?.id!)
        this.socketService.removeAllListeners();
      }
    });
  }

  partnerId?: number
  partner?: MessageUser

  self?: MessageUser
  messages: Map<number, Message> = new Map();
  emisor?: MessageUser
  receptor?: MessageUser

  joined = false;

  private getMessages = (body: ChatMessages) => {
    body.data.query.messages.forEach(message => {
      this.pushMessage(message)
    });

    this.partner = body.data.query.receptorUser;
    this.self = body.data.query.emisorUser;
  }

  sendMessage = (content: SendMessageSocketParams) => {
    this.socketService.sendMessage(content, this.partner!.id!);
  }

  pushMessage = (message: Message) => {
    this.messages.set(message.id, message)
  }

  handleNewMessage = (content: SendMessageApiParams) => {
    if (content.text && content.text.length > 0) {
      this.sendMessage({text: content.text})
    } else if (content.files && content.files.length > 0) {
      this.handleFilesMessage(content.files)
    }
  };

  handleJoining = (params: ChatJoin) => {
    if (params.joined) {
      this.joined = params.joined
    }
  }

  handleMessagesRead = (params: MessagesRead) => {
    if (params.messages) {
      params.messages.forEach(messageId => {
        const message = this.messages.get(messageId);

        message!.read = true;

        this.messages.set(messageId, message!);
      })
    }
  }

  handleFilesMessage(files: File[]) {
    this.chatService.uploadMessagesFile(files, this.partnerId!).subscribe(body => {
      if (body.data.files.length === files.length) {
        this.sendMessage({urls: body.data.files})
      }
    })
  }
}
