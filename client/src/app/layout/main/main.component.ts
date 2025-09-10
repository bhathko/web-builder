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
import { ComponentType } from '../header/header.component';
import { LayoutService } from '../../core/service/layout.service';

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
  constructor() {
    super();
    if (!this.domService.getRoot()) {
      this.element = {
        type: ComponentType.DIV,
        children: [],
        id: 'root',
      };
      this.domService.setRoot(this.element);
    } else {
      const rootElement = this.domService.getRoot();
      if (rootElement) {
        this.element = rootElement;
      }
    }
  }

  ngAfterViewInit(): void {
    this.placeholderService.containerRef = this.mainRef;
  }
  _onClick(event: MouseEvent) {
    event.stopPropagation();
    this.layoutService.closeLeftPanel();
  }
}
