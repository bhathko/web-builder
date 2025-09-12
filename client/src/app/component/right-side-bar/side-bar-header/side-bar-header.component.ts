import { Component, inject, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { IDynamicElement } from '../../../core/model/Config';
import { LayoutService } from '../../../core/service/layout.service';
import { ProjectService } from '../../../core/service/project.service';

@Component({
  selector: 'app-side-bar-header',
  imports: [
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './side-bar-header.component.html',
  styleUrl: './side-bar-header.component.scss',
})
export class SideBarHeaderComponent implements OnChanges {
  @Input() element!: IDynamicElement;

  layoutService = inject(LayoutService);
  projectService = inject(ProjectService);

  hasGridParent: boolean = false;

  colspanControl = new FormControl(1);

  ngOnChanges(): void {
    if (this.element && this.element.id) {
      const parent = this.projectService.getNodeParent(this.element.id);
      if (parent && parent.type === 'grid_view') {
        this.hasGridParent = true;
      } else {
        this.hasGridParent = false;
      }
    } else {
      this.hasGridParent = false;
    }
  }

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

  onColSpanChange(event: any) {
    if (this.element && this.hasGridParent) {
      this.element.props = {
        ...this.element.props,
        colSpan: event,
      };
    }
  }
}
