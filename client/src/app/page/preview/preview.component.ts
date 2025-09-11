import {
  AfterViewInit,
  Component,
  ComponentRef,
  inject,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { PreviewBlockComponent } from '../../preview-component/preview-block/preview-block.component';
import { PreviewCardComponent } from '../../preview-component/preview-card/preview-card.component';
import { InputComponent } from '../../component/input/input.component';
import { SelectComponent } from '../../component/select/select.component';
import { ButtonComponent } from '../../component/button/button.component';
import { PreviewBaseDirective } from '../../preview-component/preview-base/preview-base';
import { take } from 'rxjs';
import { ProjectService } from '../../core/service/project.service';
import { IDynamicElement } from '../../core/model/Config';
import { PreviewGridViewComponent } from '../../preview-component/preview-grid-view/preview-grid-view.component';

export type LayoutComponent = {
  type: string;
  id: string;
  children?: LayoutComponent[];
};

const PreviewComponentMap = new Map<string, Type<any>>([
  ['div', PreviewBlockComponent],
  ['card', PreviewCardComponent],
  ['input', InputComponent],
  ['select', SelectComponent],
  ['button', ButtonComponent],
  ['grid_view', PreviewGridViewComponent],
]);

@Component({
  selector: 'app-preview',
  imports: [],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent implements AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef })
  private rendererHost!: ViewContainerRef;

  projectService = inject(ProjectService);

  items: Array<IDynamicElement> = [];

  ngAfterViewInit(): void {
    this.items = [JSON.parse(localStorage.getItem('previewData') || '{}')];
    this.render();
  }

  render() {
    if (!this.rendererHost) return;
    this.rendererHost.clear();
    this.items.forEach((item) => {
      if (item) {
        this.renderItem(item, this.rendererHost);
      }
    });
  }

  renderItem(item: IDynamicElement, parentContainer: ViewContainerRef) {
    const componentType = PreviewComponentMap.get(item.type!);
    if (componentType) {
      const componentRef = parentContainer.createComponent(componentType);
      componentRef.instance.id = item.id;
      componentRef.instance.element = item;
      if (
        (componentRef as ComponentRef<PreviewBaseDirective>).instance
          .initComplete
      ) {
        (
          componentRef as ComponentRef<PreviewBaseDirective>
        ).instance.initComplete
          .pipe(take(1))
          .subscribe({
            next: () => {
              if (item.children) {
                item.children.forEach((child) => {
                  this.renderItem(child, componentRef.instance.container);
                });
              }
            },
          });
      }
    }
  }
}
