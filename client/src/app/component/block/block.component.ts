import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DynamicComponentComponent } from '../dynamic-component/dynamic-component.component';
import { DndModule } from 'ngx-drag-drop';
import { BaseComponent } from '../../core/base/base-component';

@Component({
  selector: 'app-block',
  imports: [DynamicComponentComponent, DndModule],
  templateUrl: './block.component.html',
  styleUrl: './block.component.scss',
})
export class BlockComponent
  extends BaseComponent
  implements OnInit
{
  @ViewChild('block', { static: true })
  dragImageRef!: ElementRef;
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.element.children = this.element.children || [];
  }
}
