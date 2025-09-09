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
  FlexRow = 'flex-row',
  Card = 'card',
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
