import { Component, OnInit } from "@angular/core";
import { ChatComponent } from "../chat/chat.component";
import { ChatListComponent } from "../chat-list/chat-list.component";
import { PendingChat } from "../../../interfaces/usuario";
import { UserChat } from "../../../interfaces/usuario";
import { ChatService } from "../../../services/chat.service";

@Component({
  selector: "app-chat-base",
  standalone: true,
  imports: [ChatComponent, ChatListComponent],
  templateUrl: "./chat-base.component.html",
  styleUrls: ["./chat-base.component.css"],
})
export class ChatBaseComponent implements OnInit {
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.listenForChats((chat) => {
      console.log("Nuevo chat recibido:", chat);
    });
  }
}
