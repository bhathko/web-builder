import { Untitled ProjectComponent } from './pages/Untitled Project/untitled-project.component';

import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [Untitled ProjectComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('low-code-factory');
}
