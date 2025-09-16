import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  IDynamicElement,
  ComponentEnum,
  LayoutComponentEnum,
} from '../../core/model/Config.type';
import { ProjectService } from '../../core/service/project.service';
import { PlaceholderService } from '../../core/service/placeholder.service';
import { UtilsService } from '../../core/service/utils.service';
import { DndModule } from 'ngx-drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../../core/service/layout.service';
import { DEFAULT_SELECT_OPTIONS } from './left-side-bar.const';
import { SelectOption } from '../../core/model/Common.type';

@Component({
  selector: 'app-left-side-bar',
  imports: [DndModule, MatIconModule],
  templateUrl: './left-side-bar.component.html',
  styleUrl: './left-side-bar.component.scss',
})
export class LeftSideBarComponent {
  http = inject(HttpClient);

  projectService = inject(ProjectService);
  utilsService = inject(UtilsService);
  layoutService = inject(LayoutService);
  placeholderService = inject(PlaceholderService);

  components: IDynamicElement[] = [
    {
      type: ComponentEnum.Button,
      content: 'Button1',
      props: {},
    },
    {
      type: ComponentEnum.Input,
      props: {},
    },
    {
      type: ComponentEnum.Select,
      props: {},
      data: this.deepCopy<Array<SelectOption>>(DEFAULT_SELECT_OPTIONS),
    },
    {
      type: LayoutComponentEnum.Card,
      children: [],
      props: {},
    },
    {
      type: LayoutComponentEnum.GridView,
      children: [],
      props: {
        column: '3',
        gap: '10',
      },
    },
  ];
  generateProject() {
    this.http
      .post('api/generate', this.projectService.getRootNode())
      .subscribe((res) => {
        console.log(res);
      });
  }

  onDragStart(event: any, component: IDynamicElement) {
    event.dataTransfer.setDragImage(this.utilsService.dragImage, 0, 0);
  }

  onDragEnd() {
    this.placeholderService.hide();
  }
  onDragMoved(event: MouseEvent) {
    if (event.clientX > 300) {
      this.layoutService.closeLeftPanel();
    }
  }

  deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
