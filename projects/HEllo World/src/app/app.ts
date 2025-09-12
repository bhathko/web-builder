import { HEllo WorldComponent } from './pages/HEllo World/hello-world.component';

import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [HEllo WorldComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('low-code-factory');
}
