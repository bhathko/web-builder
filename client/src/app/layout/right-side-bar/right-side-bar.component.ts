import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RightPanelService } from '../../core/service/right-panel.service';
import { IDynamicElement } from '../../core/model/Config';
import { SideBarHeaderComponent } from '../../component/right-side-bar/side-bar-header/side-bar-header.component';

@Component({
  selector: 'app-right-side-bar',
  imports: [],
  templateUrl: './right-side-bar.component.html',
  styleUrl: './right-side-bar.component.scss',
})
export class RightSideBarComponent implements OnInit, OnDestroy {
  rightPanelService = inject(RightPanelService);

  @ViewChild('headerContainer', { read: ViewContainerRef })
  headerVc!: ViewContainerRef;
  @ViewChild('contentContainer', { read: ViewContainerRef })
  contentVc!: ViewContainerRef;
  @ViewChild('footerContainer', { read: ViewContainerRef })
  footerVc!: ViewContainerRef;

  ngOnInit(): void {
    this.rightPanelService.getElementData().subscribe((data) => {
      if (data) {
        this.renderHeader(data);
      }
    });
  }

  ngOnDestroy(): void {
    this.headerVc.clear();
    this.contentVc.clear();
    this.footerVc.clear();
  }

  renderHeader(data: IDynamicElement) {
    this.headerVc.clear();
    const headerComponent = this.headerVc.createComponent(
      SideBarHeaderComponent
    );
    headerComponent.setInput?.('element', data);
  }

  renderContent() {
    this.contentVc.clear();
  }

  renderFooter() {}
}
