import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { DynamicComponentComponent } from '../../component/dynamic-component/dynamic-component.component';
import { DndModule } from 'ngx-drag-drop';
import { BaseComponent } from '../../core/base/base-component';
import { AsyncPipe } from '@angular/common';
import { PlaceholderComponent } from '../../core/shared/component/placeholder/placeholder.component';

import { LayoutService } from '../../core/service/layout.service';
import { ComponentType } from '../../core/model/enum/Component.enum';
import { LoadingService } from '../../core/service/loading.service';

@Component({
  selector: 'app-main',
  imports: [
    DynamicComponentComponent,
    DndModule,
    AsyncPipe,
    PlaceholderComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  host: {
    '(click)': '_onClick($event)',
  },
})
export class MainComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('mainContent', { static: true }) mainRef!: ElementRef;
  layoutService = inject(LayoutService);
  loadingService = inject(LoadingService);

  refreshPage$ = this.loadingService.refreshPage$;
  constructor() {
    super();

    this.projectService.rootNode$.subscribe((root) => {
      if (root) {
        this.element = root;
        this.loadNewProject();
      }
    });

    if (!this.projectService.getRootNode()) {
      this.projectService.initializeProject();
    }
  }

  ngAfterViewInit(): void {
    this.placeholderService.containerRef = this.mainRef;
  }
  _onClick(event: MouseEvent) {
    event.stopPropagation();
    this.layoutService.closeLeftPanel();
  }

  loadNewProject() {
    setTimeout(() => {
      // Load your new project data here
      this.loadingService.pageRefreshed();
    }, 1000);
  }
}
