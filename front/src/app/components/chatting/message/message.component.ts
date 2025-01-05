// message.component.ts
import { Component, Input } from "@angular/core";
import { SendMessageComponent } from "../send-message/send-message.component";
import { ReceivedMessageComponent } from "../received-message/received-message.component";
import { Message } from "../../../interfaces/message";
import { MessageUser } from "../../../interfaces/message";

@Component({
  selector: "app-message",
  standalone: true,
  imports: [ReceivedMessageComponent, SendMessageComponent],
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.css"],
})
export class MessageComponent {
  @Input() message!: Message;
  @Input() self!: MessageUser;
  @Input() partner!: MessageUser;
  emisorId = 0;

  ngOnInit() {
    this.emisorId = Number(this.message.emisor);
    console.log(this.emisorId);
    console.log("hola", this.message);
    console.log("self", this.self);
    console.log("partner", this.partner);
  }
}
