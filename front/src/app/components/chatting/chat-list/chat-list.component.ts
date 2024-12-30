import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserChat } from '../../../interfaces/usuario';
import { PendingChat } from '../../../interfaces/usuario';
import { MessageUser } from '../../../interfaces/message';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent {
  @Input() pending?: Map<number, PendingChat>;
  @Input() notPending?: Map<number, UserChat>;

  receptores: MessageUser[] = []; 

  constructor(private router: Router, private chatService: ChatService) {}

  ngOnInit() {
    const emisorId = 1; 
    this.loadReceptores(emisorId);
  }

  loadReceptores(emisorId: number) {
    this.chatService.getReceptoresPorEmisor(emisorId).subscribe(response => {
      console.log('Respuesta del servidor:', response);
      if (response.success) {
        this.receptores = response.data.receptoresConInfo;
        console.log('Receptores:', this.receptores);
      } else {
        this.receptores = []; 
      }
    }, error => {
      console.error('Error al cargar receptores:', error);
      this.receptores = []; 
    });
  }

  goToChat = async (user: PendingChat | UserChat) => {
    await this.router.navigate(['chat', {id: user.id}]);
  };
}
