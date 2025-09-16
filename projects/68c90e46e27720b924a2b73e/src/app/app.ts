import { HelloweComponent } from './pages/Hellowe/hellowe.component';

import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [HelloweComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('low-code-factory');
}
