import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ChatListComponent } from '../chat-list/chat-list.component';
import { PendingChat } from '../../../interfaces/usuario';
import { UserChat } from '../../../interfaces/usuario';

@Component({
  selector: 'app-chat-base',
  standalone: true,
  imports: [ChatComponent, ChatListComponent],
  templateUrl: './chat-base.component.html',
  styleUrl: './chat-base.component.css'
})
export class ChatBaseComponent {
  pending: Map<number, PendingChat> = new Map<number, PendingChat>();
  notPending: Map<number, UserChat> = new Map<number, UserChat>();
}
