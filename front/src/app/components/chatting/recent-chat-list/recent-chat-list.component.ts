import { Component } from '@angular/core';
import { PendingChat, UserChat } from '../../../interfaces/usuario';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-recent-chat-list',
  standalone: true,
  imports: [],
  templateUrl: './recent-chat-list.component.html',
  styleUrl: './recent-chat-list.component.css'
})
export class RecentChatListComponent {
  constructor(private router: Router) {}

  @Input() pending?: Map<number, PendingChat>;
  @Input() notPending?: Map<number, UserChat>;

  goToChat = async (user: PendingChat | UserChat) => {
    await this.router.navigate(['chat', {id: user.id}]);
  };
}
