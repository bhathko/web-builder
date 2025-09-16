import { IDynamicElement } from './Config.type';

export enum DndDropEffect {
  Copy = 'copy',
  Move = 'move',
  Link = 'link',
  None = 'none',
}

export type DragState = {
  srcNode: IDynamicElement | null;
  targetId: string | null;
  position: DragMovePosition | null;
};

export enum DragMovePosition {
  Before = 'before',
  Middle = 'middle',
  After = 'after',
}
