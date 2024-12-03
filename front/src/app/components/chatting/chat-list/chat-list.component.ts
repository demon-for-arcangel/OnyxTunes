import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserChat } from '../../../interfaces/usuario';
import { PendingChat } from '../../../interfaces/usuario';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css'
})
export class ChatListComponent {
  constructor(private router: Router) {}

  @Input() pending?: Map<number, PendingChat>;
  @Input() notPending?: Map<number, UserChat>;

  goToChat = async (user: PendingChat | UserChat) => {
    await this.router.navigate(['chat', {id: user.id}]);
  };
}
