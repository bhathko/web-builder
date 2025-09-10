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

  onAlignChange(event: any) {
    if (this.element) {
      this.element.props = {
        ...this.element.props,
        align: event,
      };
    }
  }

  onClosePanel() {
    this.layoutService.setElementData(null);
    this.layoutService.closeRightPanel();
  }
}
