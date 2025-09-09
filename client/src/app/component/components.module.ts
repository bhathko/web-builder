import { Type } from '@angular/core';
import { ButtonComponent } from './button/button.component';
import { BlockComponent } from './block/block.component';
import { InputComponent } from './input/input.component';
import { CardComponent } from './card/card.component';
import { SelectComponent } from './select/select.component';
import { PreviewBlockComponent } from '../preview-component/preview-block/preview-block.component';
import { PreviewCardComponent } from '../preview-component/preview-card/preview-card.component';

export const COMPONENT_MAP = new Map<string, Type<any>>([
  ['button', ButtonComponent],
  ['block', BlockComponent],
  ['input', InputComponent],
  ['card', CardComponent],
  ['select', SelectComponent],
]);

export const PREVIEW_COMPONENT_MAP = new Map<string, Type<any>>([
  ['button', ButtonComponent],
  ['block', PreviewBlockComponent],
  ['input', InputComponent],
  ['card', PreviewCardComponent],
  ['select', SelectComponent],
]);
