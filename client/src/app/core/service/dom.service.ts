import { Injectable } from '@angular/core';
import { DEFAULT_DRAG_STATE, IDynamicElement } from '../model/Config';
import { BehaviorSubject } from 'rxjs';
import { DragState } from '../model/EventTypes';

@Injectable({
  providedIn: 'root',
})
export class DomService {
  private rootNode: BehaviorSubject<IDynamicElement | null> =
    new BehaviorSubject<IDynamicElement | null>(null);

  private parentMap = new Map<string, IDynamicElement>();
  private dragHelper: BehaviorSubject<DragState> =
    new BehaviorSubject<DragState>(DEFAULT_DRAG_STATE);

  constructor() {}

  getParent(id: string): IDynamicElement | undefined {
    return this.parentMap.get(id);
  }

  setParent(id: string, parent: IDynamicElement): void {
    this.parentMap.set(id, parent);
  }
  setDragHelper(change: DragState): void {
    this.dragHelper.next(change);
  }

  getDragHelper(): DragState {
    return this.dragHelper.getValue();
  }

  setRoot(root: IDynamicElement) {
    this.rootNode.next(root);
  }

  getRoot(): IDynamicElement | null {
    return this.rootNode.getValue();
  }
}
