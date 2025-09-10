import { Component, inject } from '@angular/core';
import { ComponentService } from './core/service/component.service';

import { DndModule } from 'ngx-drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    DndModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  componentService = inject(ComponentService);

  constructor() {
    this.componentService.registerDynamicComponent();
  }
}
