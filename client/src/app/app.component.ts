import { Component, inject } from '@angular/core';
import { ComponentService } from './core/service/component.service';

import { DndModule } from 'ngx-drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from './core/service/loading.service';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    DndModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterOutlet,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  componentService = inject(ComponentService);
  loadingService = inject(LoadingService);
  loading$ = this.loadingService.loading$;
  refresh$ = this.loadingService.refreshPage$;
  showLoading$ = combineLatest([this.loading$, this.refresh$]).pipe(
    map(([loading, refresh]) => loading || refresh)
  );

  constructor() {
    this.componentService.registerDynamicComponent();
  }
}
