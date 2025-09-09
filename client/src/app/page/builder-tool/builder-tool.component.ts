import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MainComponent } from '../../layout/main/main.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { LeftSideBarComponent } from '../../layout/left-side-bar/left-side-bar.component';
import { RightSideBarComponent } from '../../layout/right-side-bar/right-side-bar.component';
import { RightPanelService } from '../../core/service/right-panel.service';

@Component({
  selector: 'app-builder-tool',
  imports: [
    MainComponent,
    LeftSideBarComponent,
    RightSideBarComponent,
    HeaderComponent,
    MatSidenavModule,
  ],
  templateUrl: './builder-tool.component.html',
  styleUrl: './builder-tool.component.scss',
})
export class BuilderToolComponent implements OnInit {
  @ViewChild(MatDrawer) drawer!: MatDrawer;

  rightSideOpen = signal<boolean>(false);
  rightPanelService = inject(RightPanelService);

  ngOnInit(): void {
    this.rightSideOpen = this.rightPanelService.open;
  }
}
