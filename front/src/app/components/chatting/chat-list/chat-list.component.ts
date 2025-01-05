import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserChat } from "../../../interfaces/usuario";
import { MessageUser } from "../../../interfaces/message";
import { ChatService } from "../../../services/chat.service";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-chat-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./chat-list.component.html",
  styleUrls: ["./chat-list.component.css"],
})
export class ChatListComponent implements OnInit {
  chats: UserChat[] = [];
  usuarioId?: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
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

        this.usuarioId = user.id;

        if (this.usuarioId) {
          this.loadChats(this.usuarioId);
        }
      },
      (error) => {
        console.error("Error al obtener el usuario desde el token:", error);
      },
    );
  }

  loadChats(usuarioId: number) {
    this.chatService.getChatsByUser(usuarioId).subscribe(
      (response) => {
        if (response.success) {
          this.chats = response.chats;
          console.log("Chats cargados:", this.chats);
        } else {
          console.error("Error en la respuesta del servidor:", response);
          this.chats = [];
        }
      },
      (error) => {
        console.error("Error al obtener los chats:", error);
        this.chats = [];
      },
    );
  }

  goToChat(chat: UserChat) {
    // Aquí accedemos al partnerId desde el chat y lo pasamos en la URL
    const partnerId = chat.id; // O cualquier campo que sea el ID del partner en el objeto chat
    this.router.navigate(["chat", { id: partnerId }]);
  }
}
