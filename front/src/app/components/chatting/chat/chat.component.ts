import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MessageComponent } from "../message/message.component";
import { MessageInputComponent } from "../message-input/message-input.component";
import { Subscription } from "rxjs";
import { AuthService } from "../../../services/auth.service";
import { ChatService } from "../../../services/chat.service";
import { Message, MessageUser } from "../../../interfaces/message";
import { Usuario } from "../../../interfaces/usuario";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MessageComponent,
    MessageInputComponent,
  ],
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit, OnDestroy {
  partnerId?: number;
  messages: Message[] = [];
  self?: any;
  private paramSubscription: Subscription = new Subscription();
  partnerTyping: boolean = false;
  partner?: MessageUser;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    const tokenObject = localStorage.getItem("user");
    if (!tokenObject) {
      console.error("No se encontró el token en el almacenamiento local.");
      return;
    }

    this.authService.getUserByToken(tokenObject).subscribe(
      (user) => {
        if (!user) {
          console.error("Usuario no encontrado.");
          return;
        }

        this.self = user.id;

        this.userService.getUserById(this.self!.toString()).subscribe(
          (self) => {
            this.self = self;
          },
          (error) => {
            console.error("Error al obtener los datos del partner:", error);
          },
        );

        this.paramSubscription = this.route.paramMap.subscribe((params) => {
          const id = params.get("id");
          this.partnerId = id ? Number(id) : 0;

          if (this.partnerId === 0) {
            return;
          }

          this.userService.getUserById(this.partnerId!.toString()).subscribe(
            (partner) => {
              this.partner = partner;
            },
            (error) => {
              console.error("Error al obtener los datos del partner:", error);
            },
          );

          this.loadMessages();
          this.chatService.connectToChat(this.self, this.partnerId!);
        });
      },
      (error) => {
        console.error("Error al obtener el usuario desde el token:", error);
      },
    );
  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  loadMessages() {
    const emisorId = this.self;
    const receptorId = this.partnerId;

    if (emisorId && receptorId) {
      this.chatService.getMessages(emisorId, receptorId).subscribe(
        (response) => {
          if (response.success) {
            this.messages = response.mensajes;
          } else {
            console.error("Error al obtener los mensajes:", response);
          }
        },
        (error) => {
          console.error("Error al obtener los mensajes:", error);
        },
      );
    }
  }

  pushMessage(message: Message) {
    this.messages.push(message);
  }

  handleNewMessage(content: any) {
    if (content.text && content.text.length > 0) {
      this.chatService.sendMessageToSocket(
        content.text,
        this.self,
        this.partnerId!,
      );
    }
  }

  handleTyping(content: any) {
    if (content.text && content.text.length > 0) {
      this.chatService.emitTypingStatus(this.partnerId!, true);
    } else {
      this.chatService.emitTypingStatus(this.partnerId!, false);
    }
  }
}
