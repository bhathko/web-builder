import { Component, inject, Input } from '@angular/core';
import { IComponentType, IDynamicElement } from '../model/Config';
import { DomService } from '../service/dom.service';
import { DndDropEvent } from 'ngx-drag-drop';
import { DndDropEffect, DragMovePosition } from '../model/EventTypes';
import { UtilsService } from '../service/utils.service';
import { PlaceholderService } from '../service/placeholder.service';

@Component({
  template: '',
})
export class BaseComponent {
  // Helper to insert at clamped index
  private insertAt(arr: any[], idx: number, value: any) {
    idx = Math.max(0, Math.min(idx, arr.length));
    return [...arr.slice(0, idx), value, ...arr.slice(idx)];
  }
  @Input() protected element!: IDynamicElement;

  domService!: DomService;
  utilsService!: UtilsService;
  placeholderService!: PlaceholderService;
  constructor() {
    this.domService = inject(DomService);
    this.utilsService = inject(UtilsService);
    this.placeholderService = inject(PlaceholderService);
  }

  onDrop(event: DndDropEvent) {
    if (event.dropEffect === DndDropEffect.Copy) {
      this.handleCopyEffect(event);
    } else if (event.dropEffect === DndDropEffect.Move) {
      this.handleMoveEffect(event);
    }
    this.placeholderService.hide();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const bounding = (
      event.currentTarget as HTMLElement
    )?.getBoundingClientRect();
    if (this.element.props?.['align'] === 'horizontal') {
      const x = event.clientX - bounding.left;
      const dragHelper = this.domService.getDragHelper();
      if (x < Math.floor(bounding.width / 3)) {
        this.placeholderService.show(
          event.currentTarget as HTMLElement,
          DragMovePosition.Before,
          'horizontal'
        );
        this.domService.setDragHelper({
          ...dragHelper,
          targetId: (event.currentTarget as HTMLElement).id,
          position: DragMovePosition.Before,
        });
      } else if (
        x < Math.floor((bounding.width * 2) / 3) &&
        x >= Math.floor(bounding.width / 3)
      ) {
        this.placeholderService.show(
          event.currentTarget as HTMLElement,
          DragMovePosition.Middle,
          'horizontal'
        );
        this.domService.setDragHelper({
          ...dragHelper,
          targetId: (event.currentTarget as HTMLElement).id,
          position: DragMovePosition.Middle,
        });
      } else {
        this.placeholderService.show(
          event.currentTarget as HTMLElement,
          DragMovePosition.After,
          'horizontal'
        );
        this.domService.setDragHelper({
          ...dragHelper,
          targetId: (event.currentTarget as HTMLElement).id,
          position: DragMovePosition.After,
        });
      }
    } else {
      const y = event.clientY - bounding.top;

      const dragHelper = this.domService.getDragHelper();

      if (y < Math.floor(bounding.height / 3)) {
        this.placeholderService.show(
          event.currentTarget as HTMLElement,
          DragMovePosition.Before
        );
        this.domService.setDragHelper({
          ...dragHelper,
          targetId: (event.currentTarget as HTMLElement).id,
          position: DragMovePosition.Before,
        });
      } else if (
        y < Math.floor((bounding.height * 2) / 3) &&
        y >= Math.floor(bounding.height / 3)
      ) {
        this.placeholderService.show(
          event.currentTarget as HTMLElement,
          DragMovePosition.Middle
        );
        this.domService.setDragHelper({
          ...dragHelper,
          targetId: (event.currentTarget as HTMLElement).id,
          position: DragMovePosition.Middle,
        });
      } else {
        this.placeholderService.show(
          event.currentTarget as HTMLElement,
          DragMovePosition.After
        );
        this.domService.setDragHelper({
          ...dragHelper,
          targetId: (event.currentTarget as HTMLElement).id,
          position: DragMovePosition.After,
        });
      }
    }
  }

  private handleCopyEffect(event: DndDropEvent): void {
    const id = `${event.data.type}-${this.utilsService.getUniqueId()}`;
    const newChild = { ...event.data, id };
    this.element.children ??= [];
    const dragHelper = this.domService.getDragHelper();
    const parent = dragHelper.targetId
      ? this.domService.getParent(dragHelper.targetId)
      : this.domService.getRoot();

    if (!parent) return;
    parent.children ??= [];
    this.domService.setParent(id, parent);

    let index = parent.children.findIndex(
      (item: any) => item.id === dragHelper.targetId
    );
    if (index === -1) index = parent.children.length; // Default to end if not found

    switch (dragHelper.position) {
      case DragMovePosition.Before:
        parent.children = this.insertAt(parent.children, index, newChild);
        break;
      case DragMovePosition.Middle:
        if (
          this.utilsService.isLayoutComponent(
            dragHelper.targetId?.split('-')[0]! as IComponentType
          )
        ) {
          this.domService.setParent(newChild.id, this.element);
          this.element.children = this.insertAt(
            this.element.children,
            this.element.children.length,
            newChild
          );
        } else {
          parent.children = this.insertAt(parent.children, index + 1, newChild);
        }
        // For middle, treat as before

        break;
      case DragMovePosition.After:
        parent.children = this.insertAt(parent.children, index + 1, newChild);
        break;
      default:
        // Fallback: insert after index
        parent.children = this.insertAt(parent.children, index + 1, newChild);
        break;
    }
    return;
  }

  private handleMoveEffect(event: DndDropEvent): void {
    const sourceParent = this.domService.getParent(event.data.id);
    if (!sourceParent) return;
    const index = sourceParent.children?.findIndex(
      (item) => item.id === event.data.id
    );
    if (index === undefined || index < 0) return;
    const [temp] = sourceParent.children?.splice(index, 1) ?? [];
    console.log(temp, 'moved temp', sourceParent);
    if (!temp || !temp.id) return;
    this.element.children ??= [];
    const dragHelper = this.domService.getDragHelper();
    const targetParent = dragHelper.targetId
      ? this.domService.getParent(dragHelper.targetId)
      : this.domService.getRoot();

    if (!targetParent) return;
    targetParent.children ??= [];
    this.domService.setParent(temp.id, targetParent);

    let targetIndex = targetParent.children.findIndex(
      (item: any) => item.id === dragHelper.targetId
    );
    if (targetIndex === -1) targetIndex = targetParent.children.length; // Default to end if not found

    switch (dragHelper.position) {
      case DragMovePosition.Before:
        targetParent.children = this.insertAt(
          targetParent.children,
          targetIndex,
          temp
        );
        break;
      case DragMovePosition.Middle:
        // For middle, treat as before
        console.log(
          this.utilsService.isLayoutComponent,
          dragHelper.targetId?.split('-')[0]! as IComponentType
        );
        if (
          this.utilsService.isLayoutComponent(
            dragHelper.targetId?.split('-')[0]! as IComponentType
          )
        ) {
          console.log(this.element, 'element be parent');
          this.domService.setParent(temp.id, this.element);
          this.element.children = this.insertAt(
            this.element.children,
            this.element.children.length,
            temp
          );
        } else {
          console.log(targetParent, 'targetParent be parent');
          targetParent.children = this.insertAt(
            targetParent.children,
            targetIndex + 1,
            temp
          );
          console.log(targetParent.children, 'targetParent children');
        }

        break;
      case DragMovePosition.After:
        targetParent.children = this.insertAt(
          targetParent.children,
          targetIndex + 1,
          temp
        );
        break;
      default:
        // Fallback: insert after index
        targetParent.children = this.insertAt(
          targetParent.children,
          targetIndex + 1,
          temp
        );
        break;
    }
    return;
  }
}
