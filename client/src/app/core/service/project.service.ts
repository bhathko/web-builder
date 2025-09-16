import { inject, Injectable } from '@angular/core';
import { DEFAULT_DRAG_STATE, IDynamicElement } from '../model/Config.type';
import { BehaviorSubject } from 'rxjs';
import { DragState } from '../model/Event.types';
import { UtilsService } from './utils.service';
import { ProjectRepository } from '../repository/project/project.repository';
import { SaveProjectRes } from '../repository/project/project.model';
import { ComponentType } from '../model/enum/Component.enum';

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

  projectRepository = inject(ProjectRepository);

  rootNode$ = this.rootNode.asObservable();

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

  deleteProject(id: string) {
    return this.projectRepository.onDeleteProject(id);
  }

  loadProject(project: SaveProjectRes) {
    if (!project || !project.data) return;
    this.setProjectInfo({ id: project.data._id, name: project.data.name });
    this.setRootNode(project.data.component);
    this.parentMap.clear();
    this.buildParentMap(project.data.component, null);
  }

  initializeProject() {
    this.setRootNode({
      type: ComponentType.DIV,
      children: [],
      id: 'root',
      props: {},
    });
  }

  resetProject() {
    this.setProjectInfo({ id: undefined, name: 'Untitled Project' });
    this.parentMap.clear();
    this.dragHelper.next(DEFAULT_DRAG_STATE);
    this.initializeProject();
  }

  private buildParentMap(
    node: IDynamicElement,
    parent: IDynamicElement | null
  ): void {
    if (parent) {
      this.parentMap.set(node.id!, parent);
    }
    node.children?.forEach((child) => {
      this.buildParentMap(child, node);
    });
  }
}
