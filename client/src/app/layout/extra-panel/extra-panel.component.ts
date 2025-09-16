import {
  AfterViewInit,
  Component,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ExtraPanelService } from '../../core/service/extra-panel.service';

@Component({
  selector: 'app-extra-panel',
  imports: [],
  templateUrl: './extra-panel.component.html',
  styleUrl: './extra-panel.component.scss',
})
export class ExtraPanelComponent implements AfterViewInit {
  @ViewChild('panelContainer', { read: ViewContainerRef })
  panelVc!: ViewContainerRef;

  extraPanelService = inject(ExtraPanelService);

  ngAfterViewInit(): void {
    this.extraPanelService.open$.subscribe((components) => {
      if (components.length === 0) {
        this.panelVc.clear();
      } else {
        this.panelVc.clear();
        components.forEach((component) => {
          this.panelVc.createComponent(component);
        });
      }
    });
  }
}
