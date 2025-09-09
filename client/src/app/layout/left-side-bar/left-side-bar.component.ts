import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  IDynamicElement,
  ComponentEnum,
  LayoutComponentEnum,
} from '../../core/model/Config';
import { DomService } from '../../core/service/dom.service';
import { PlaceholderService } from '../../core/service/placeholder.service';
import { UtilsService } from '../../core/service/utils.service';
import { DndModule } from 'ngx-drag-drop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-left-side-bar',
  imports: [DndModule, MatIconModule],
  templateUrl: './left-side-bar.component.html',
  styleUrl: './left-side-bar.component.scss',
})
export class LeftSideBarComponent {
  http = inject(HttpClient);

  domService = inject(DomService);
  utilsService = inject(UtilsService);
  placeholderService = inject(PlaceholderService);

  components: IDynamicElement[] = [
    {
      type: ComponentEnum.Button,
      content: 'Button1',
    },
    {
      type: ComponentEnum.Input,
    },
    {
      type: ComponentEnum.Select,
    },
    {
      type: LayoutComponentEnum.Card,
      children: [],
    },
  ];
  generateProject() {
    this.http
      .post('api/generate', this.domService.getRoot())
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
}
