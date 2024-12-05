import {Component, Input} from '@angular/core';
import { SendMessageComponent } from '../send-message/send-message.component';
import { ReceivedMessageComponent } from '../received-message/received-message.component';
import { Message } from '../../../interfaces/message';
import { MessageUser } from '../../../interfaces/message';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [ReceivedMessageComponent, SendMessageComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() messages: Map<number, Message> = new Map();

  @Input() self?: MessageUser;
  @Input() partner?: MessageUser;


}
