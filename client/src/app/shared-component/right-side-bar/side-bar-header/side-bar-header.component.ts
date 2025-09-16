import { Component, inject, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { IDynamicElement } from '../../../core/model/Config.type';
import { LayoutService } from '../../../core/service/layout.service';
import { ProjectService } from '../../../core/service/project.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-side-bar-header',
  imports: [
    MatButtonModule,
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
  extraPanelService = inject(LayoutService);

  ngOnChanges(): void {}

  onClosePanel() {
    this.layoutService.setElementData(null);
    this.layoutService.closeRightPanel();
    this.extraPanelService.closeRightPanel();
  }
}
