import {
  AfterViewInit,
  Directive,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { IDynamicElement } from '../../core/model/Config.type';

@Directive()
export abstract class PreviewBaseDirective implements AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef })
  container!: ViewContainerRef;
  initComplete = new Subject<boolean>();
  element!: IDynamicElement;

  ngAfterViewInit(): void {
    this.initComplete.next(true);
  }
}
