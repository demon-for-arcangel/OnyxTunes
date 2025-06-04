import { Component, OnInit } from "@angular/core";
import { PendingChat, UserChat } from "../../../interfaces/usuario";
import { Router } from "@angular/router";
import { UserService } from "../../../services/user.service";
import { ChatService } from "../../../services/chat.service";
import { NewMessageArgs } from "../../../interfaces/message";

@Component({
  selector: "app-chat-pending",
  standalone: true,
  imports: [],
  templateUrl: "./chat-pending.component.html",
  styleUrls: ["./chat-pending.component.css"],
})
export class ChatPendingComponent implements OnInit {
  pending = new Map<number, PendingChat>();
  notPending = new Map<number, UserChat>();

  constructor(
    private userService: UserService,
    private router: Router,
    private chatService: ChatService,
  ) {}

  ngOnInit() {
    this.loadPendingChats();

    this.chatService.listenNewMessages((args: NewMessageArgs) => {
      const pendingUser = this.pending.get(args.from);
      const notPendingUser = this.notPending.get(args.from);

      if (pendingUser) {
        this.setNewMessage(pendingUser);
      } else if (notPendingUser) {
        this.switchToPending(notPendingUser);
      } else {
        this.getNewSender(args);
      }
    });
  }

  private loadPendingChats() {
    this.chatService.getPendingChats().subscribe(
      (body) => {
        body.data.chats.notPending.forEach((user) => {
          this.notPending.set(user.id!, user!);
        });

        body.data.chats.pending.forEach((user) => {
          this.pending.set(user.id!, user!);
        });
      },
      (error) => {
        console.error("Error al cargar los chats pendientes:", error);
      },
    );
  }

  private switchToPending(user: UserChat) {
    this.notPending.delete(user.id!);
    this.pending.set(user.id!, { ...user, pendingCount: 1 });
  }

  private setNewMessage(pendingUser: PendingChat) {
    pendingUser.pendingCount++;
    this.pending.set(pendingUser.id!, pendingUser);
  }

  private getNewSender(args: NewMessageArgs) {
    this.userService.getUserById(args.from).subscribe((body) => {
      const pendingUser: PendingChat = { ...body, pendingCount: 1 };
      this.pending.set(body.data.query.id!, pendingUser);
    });
  }

  goToChat(user: PendingChat | UserChat) {
    this.router.navigate(["chat", { id: user.id }]);
  }
}
