import {Component, Input} from '@angular/core';
import {DatePipe} from "@angular/common";
import { Message, MessageUser } from '../../../interfaces/message';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.css',
  providers: []
})
export class SendMessageComponent {
  @Input() message!: Message;
  @Input() user?: MessageUser;
}
