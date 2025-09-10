import { DragState } from './EventTypes';

export type IDynamicElement = {
  type?: IComponentType;
  parent?: IDynamicElement;
  inputs?: {
    [key: string]: any;
  };
  content?: string;
  props?: {
    [key: string]: string;
  };
  children?: Array<IDynamicElement>;
  [key: string]: any;
  id?: string;
};

export enum ComponentEnum {
  Button = 'button',
  Input = 'input',
  ListSingleSelection = 'list-single-selection',
  Select = 'select',
}

export enum LayoutComponentEnum {
  Block = 'block',
  FlexRow = 'flex_row',
  Card = 'card',
  GridView = 'grid_view',
}

export type IComponentType =
  | ComponentEnum
  | LayoutComponentEnum
  | 'div'
  | 'unknown';

export const DEFAULT_DRAG_STATE: DragState = {
  srcNode: null,
  targetId: null,
  position: null,
};
