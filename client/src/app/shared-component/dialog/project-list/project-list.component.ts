import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ProjectData } from '../../../core/repository/project/project.model';
import { of, switchMap } from 'rxjs';
import { ProjectService } from '../../../core/service/project.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-list',
  imports: [
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    DatePipe,
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  items = inject<Array<any>>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ProjectListComponent>);
  dialog = inject(MatDialog);
  projectService = inject(ProjectService);
  snackbar = inject(MatSnackBar);

  ngOnInit() {
    // You can access the injected data and dialogRef here
  }

  onLoad(item: ProjectData) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      title: 'Load Project',
      message: 'Unsaved changes will be lost?',
      confirmText: 'Load',
      cancelText: 'Cancel',
    };
    this.dialog
      .open(ConfirmComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.dialogRef.close(item);
        }
      });
  }

  onDelete(item: ProjectData) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this project?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    };
    this.dialog
      .open(ConfirmComponent, dialogConfig)
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.projectService.deleteProject(item.id);
          }
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          if (this.projectService.getProjectInfo()?.id === item.id) {
            this.projectService.resetProject();
          }
          this.snackbar.open(res.message, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
          this.items = this.items.filter((i) => i.id !== item.id);
        }
      });
  }
}
