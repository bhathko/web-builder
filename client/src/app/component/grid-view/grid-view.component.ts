import { Component, ElementRef, ViewChild } from '@angular/core';
import { DynamicComponentComponent } from '../dynamic-component/dynamic-component.component';
import { DndModule } from 'ngx-drag-drop';
import { BaseComponent } from '../../core/base/base-component';

@Component({
  selector: 'app-grid-view',
  imports: [DynamicComponentComponent, DndModule],
  templateUrl: './grid-view.component.html',
  styleUrl: './grid-view.component.scss',
})
export class GridViewComponent extends BaseComponent {
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.element.children = this.element.children || [];
  }
}
