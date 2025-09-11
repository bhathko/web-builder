import { HomePageComponent } from './pages/HomePage/home-page.component';

import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [HomePageComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('low-code-factory');
}
