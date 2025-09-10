import { inject, Injectable, signal } from '@angular/core';
import {
  ComponentEnum,
  IComponentType,
  LayoutComponentEnum,
} from '../model/Config';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private index = 0;

  get dragImage() {
    return this._dragImage;
  }

  isDragging = signal(false);

  private _dragImage: HTMLImageElement = new Image();

  constructor() {
    this.dragImage.src = 'drag-img.png';
  }

  getUniqueId(): string {
    this.index++;
    return this.index.toString();
  }

  isLayoutComponent(type: IComponentType): boolean {
    return Object.values(LayoutComponentEnum).includes(
      type as LayoutComponentEnum
    );
  }

  onDragStart() {
    this.isDragging.update((_) => true);
  }

  onDragEnd() {
    this.isDragging.update((_) => false);
  }
}
