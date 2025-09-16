import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DragMovePosition } from '../model/Event.types';

export type PlaceHolderConfig = {
  left: string;
  top: string;
  width: string;
  height?: string;
};

@Injectable({
  providedIn: 'root',
})
export class PlaceholderService {
  private _placeholder = new BehaviorSubject<PlaceHolderConfig | undefined>(
    undefined
  );
  _placeholder$ = this._placeholder.asObservable();

  get containerRef(): ElementRef | undefined {
    return this._containerRef;
  }
  set containerRef(value: ElementRef | undefined) {
    this._containerRef = value;
  }
  private _containerRef: ElementRef | undefined;

  get placeholder() {
    return this._placeholder$;
  }

  show(
    targetElement: HTMLElement,
    anchor?: DragMovePosition,
    align: 'vertical' | 'horizontal' = 'vertical'
  ): void {
    if (!this.containerRef) {
      throw new Error('Container reference is not set.');
    }
    const containerRect =
      this.containerRef.nativeElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    let left = `${targetRect.left - containerRect.left}px`;
    let top = `${targetRect.top - containerRect.top}px`;
    let width = `${targetRect.width}px`;
    let height = `${targetRect.height}px`;

    if (align === 'vertical') {
      // Adjust top for anchor
      if (anchor === DragMovePosition.Before) {
        top = `${targetRect.top - containerRect.top}px`;
      } else if (anchor === DragMovePosition.Middle) {
        top = `${targetRect.top + targetRect.height / 2 - containerRect.top}px`;
      } else if (anchor === DragMovePosition.After) {
        top = `${targetRect.top + targetRect.height - containerRect.top}px`;
      }
      // width and left remain as above
      this._placeholder.next({ left, top, width });
    } else {
      // Adjust left for anchor
      if (anchor === DragMovePosition.Before) {
        left = `${targetRect.left - containerRect.left}px`;
      } else if (anchor === DragMovePosition.Middle) {
        left = `${
          targetRect.left + targetRect.width / 2 - containerRect.left
        }px`;
      } else if (anchor === DragMovePosition.After) {
        left = `${targetRect.left + targetRect.width - containerRect.left}px`;
      }
      width = `2px`;
      // top and height remain as above
      this._placeholder.next({ left, top, width, height });
    }
  }

  hide(): void {
    this._placeholder.next(undefined);
  }
}
