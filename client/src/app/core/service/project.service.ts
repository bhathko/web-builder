import { Injectable } from '@angular/core';
import { DEFAULT_DRAG_STATE, IDynamicElement } from '../model/Config';
import { BehaviorSubject } from 'rxjs';
import { DragState } from '../model/EventTypes';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectInfo = new BehaviorSubject<{
    id?: string | undefined;
    name: string;
  }>({
    id: undefined,
    name: 'Untitled Project',
  });

  private rootNode: BehaviorSubject<IDynamicElement | null> =
    new BehaviorSubject<IDynamicElement | null>(null);
  private parentMap = new Map<string, IDynamicElement>();
  private dragHelper: BehaviorSubject<DragState> =
    new BehaviorSubject<DragState>(DEFAULT_DRAG_STATE);

  constructor() {}

  getNodeParent(id: string): IDynamicElement | undefined {
    return this.parentMap.get(id);
  }

  setNodeParent(id: string, parent: IDynamicElement): void {
    this.parentMap.set(id, parent);
  }
  setDragHelper(change: DragState): void {
    this.dragHelper.next(change);
  }

  getDragHelper(): DragState {
    return this.dragHelper.getValue();
  }

  setRootNode(root: IDynamicElement) {
    this.rootNode.next(root);
  }

  getRootNode(): IDynamicElement | null {
    return this.rootNode.getValue();
  }

  setProjectInfo(info: { id?: string | undefined; name: string }) {
    this.projectInfo.next(info);
  }

  getProjectInfo() {
    return this.projectInfo.getValue();
  }
}
