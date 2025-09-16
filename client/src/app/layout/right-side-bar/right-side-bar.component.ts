import {
  Component,
  ComponentRef,
  inject,
  InjectionToken,
  Injector,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { LayoutService } from '../../core/service/layout.service';
import { IDynamicElement } from '../../core/model/Config.type';
import { SideBarHeaderComponent } from '../../shared-component/right-side-bar/side-bar-header/side-bar-header.component';
import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { ExtraPanelService } from '../../core/service/extra-panel.service';
import { CommonModule } from '@angular/common';
import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { GridViewPropsComponent } from '../../shared-component/right-side-bar/grid-view-props/grid-view-props.component';
import { CardPropsComponent } from '../../shared-component/right-side-bar/card-props/card-props.component';
import { ProjectService } from '../../core/service/project.service';
import { ColumnSpanPropsComponent } from '../../shared-component/right-side-bar/column-span-props/column-span-props.component';
import { SelectPropsComponent } from '../../shared-component/right-side-bar/select-props/select-props.component';
import { ExtraPanelComponent } from '../extra-panel/extra-panel.component';

export const COMPONENT_TYPE_TOKEN = new InjectionToken<string>(
  'COMPONENT_TYPE'
);

@Component({
  selector: 'app-right-side-bar',
  imports: [CommonModule, CdkOverlayOrigin, OverlayModule, PortalModule],
  templateUrl: './right-side-bar.component.html',
  styleUrl: './right-side-bar.component.scss',
})
export class RightSideBarComponent implements OnInit, OnDestroy {
  layoutService = inject(LayoutService);
  extraPanelService = inject(ExtraPanelService);
  projectService = inject(ProjectService);
  injector = inject(Injector);
  extraPanelOpen$ = this.extraPanelService.open$;
  extraPanelPosition = [
    {
      originX: 'start' as const,
      originY: 'top' as const,
      overlayX: 'end' as const,
      overlayY: 'top' as const,
    },
  ];

  @ViewChild('panelContainer', { read: ViewContainerRef })
  panelVc!: ViewContainerRef;

  connectionPanelPortal!: ComponentPortal<any>;

  ngOnInit(): void {
    this.layoutService.getElementData().subscribe((data) => {
      if (data) {
        this.extraPanelService.close();
        this.renderPanel(data);
      }
    });
    this.extraPanelService.open$.subscribe((open) => {
      if (open.length === 0) {
        this.connectionPanelPortal = undefined!;
      } else {
        this.connectionPanelPortal = new ComponentPortal(ExtraPanelComponent);
      }
    });
  }

  ngOnDestroy(): void {
    this.panelVc.clear();
  }

  renderPanel(data: IDynamicElement) {
    this.panelVc.clear();
    const headerComponent = this.panelVc.createComponent(
      SideBarHeaderComponent
    );
    headerComponent.setInput?.('element', data);

    const componentList = this.renderComponentList(data);
    componentList.forEach((comp) => {
      const compRef = this.panelVc.createComponent(comp);
      compRef.setInput?.('element', data);
    });
  }

  renderExtraPanel() {
    this.panelVc.clear();
  }

  renderComponentList(data: IDynamicElement): Array<Type<any>> {
    const list: Array<Type<any>> = [];
    if (data.type === 'card') {
      list.push(CardPropsComponent);
    }
    if (data.type === 'grid_view') {
      list.push(GridViewPropsComponent);
    }
    if (data.type === 'select') {
      list.push(SelectPropsComponent);
    }
    if (this.hasGridParent(data)) {
      list.push(ColumnSpanPropsComponent);
    }
    return list;
  }

  hasGridParent(data: IDynamicElement): boolean {
    if (data && data.id) {
      const parent = this.projectService.getNodeParent(data.id);
      if (parent && parent.type === 'grid_view') {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}
