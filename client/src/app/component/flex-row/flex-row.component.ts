import { Component, inject, Input, OnInit } from '@angular/core';
import { DynamicComponentComponent } from '../dynamic-component/dynamic-component.component';
import { IDynamicElement, LayoutComponentEnum } from '../../core/model/Config';
import { DndModule } from 'ngx-drag-drop';
import { UtilsService } from '../../core/service/utils.service';
import { DomService } from '../../core/service/dom.service';

@Component({
  selector: 'app-flex-row',
  imports: [DynamicComponentComponent, DndModule],
  templateUrl: './flex-row.component.html',
  styleUrl: './flex-row.component.scss',
})
export class FlexRowComponent implements OnInit {
  @Input() element!: IDynamicElement;
  @Input() cols: number = 0;

  utilsService: UtilsService;
  domService: DomService;

  constructor() {
    this.utilsService = inject(UtilsService);
    this.domService = inject(DomService);
  }

  ngOnInit(): void {
    this.element.children = this.element.children || [];
    if (this.element.children.length < this.cols) {
      for (let i = this.element.children.length; i < this.cols; i++) {
        const id = `${
          LayoutComponentEnum.Block
        }-${this.utilsService.getUniqueId()}`;
        this.element.children.push({
          type: LayoutComponentEnum.Block,
          id,
        });
        this.domService.setParent(id, this.element);
      }
    }
  }
}
