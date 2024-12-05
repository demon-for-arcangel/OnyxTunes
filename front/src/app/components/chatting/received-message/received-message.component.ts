import {Component, Input} from '@angular/core';
import {DatePipe} from "@angular/common";
import { Message, MessageUser } from '../../../interfaces/message';

@Component({
  selector: 'app-received-message',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './received-message.component.html',
  styleUrl: './received-message.component.css',
  providers: []
})
export class ReceivedMessageComponent {
  @Input() message!: Message;
  @Input() user?: MessageUser;
}
