import { Component, inject, Input, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IDynamicElement } from '../../../core/model/Config';
import { MatSelectModule } from '@angular/material/select';

import { LayoutService } from '../../../core/service/layout.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-side-bar-header',
  imports: [MatCardModule, MatSelectModule, MatIcon],
  templateUrl: './side-bar-header.component.html',
  styleUrl: './side-bar-header.component.scss',
})
export class SideBarHeaderComponent {
  @Input() element!: IDynamicElement;

  layoutService = inject(LayoutService);

  alignOptions = [
    { label: 'Horizontal', value: 'horizontal' },
    { label: 'Vertical', value: 'vertical' },
  ];

  gridColumnOptions = [
    { label: '1 Col', value: '1' },
    { label: '2 Col', value: '2' },
    { label: '3 Col', value: '3' },
    { label: '4 Col', value: '4' },
    { label: '6 Col', value: '6' },
    { label: '12 Col', value: '12' },
  ];

  onAlignChange(event: any) {
    if (this.element) {
      this.element.props = {
        ...this.element.props,
        align: event,
      };
    }
  }

  onGridColChange(event: any) {
    if (this.element) {
      this.element.props = {
        ...this.element.props,
        column: event,
      };
    }
  }

  onClosePanel() {
    this.layoutService.setElementData(null);
    this.layoutService.closeRightPanel();
  }
}
