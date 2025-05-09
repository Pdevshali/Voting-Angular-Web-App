import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PollComponent } from "./poll/poll.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PollComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vote-app';
}
