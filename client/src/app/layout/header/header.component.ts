import { HttpClient, HttpResponse } from '@angular/common/http';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderService } from './header.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjectListComponent } from '../../shared-component/dialog/project-list/project-list.component';
import { of, switchMap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingService } from '../../core/service/loading.service';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  headerService = inject(HeaderService);
  loadingService = inject(LoadingService);
  dialog = inject(MatDialog);
  snackbar = inject(MatSnackBar);

  fb = inject(FormBuilder);

  form = this.fb.group<{
    name: FormControl<string | null>;
  }>({
    name: this.fb.control('Untitled Project', [Validators.required]),
  });

  get nameControl() {
    return this.form.get('name') as FormControl;
  }

  toggleLeftSideBar = output<void>();
  editMode = signal<boolean>(false);

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  onEdit() {
    this.editMode.update((v) => !v);
  }

  onChangeName() {
    if (this.form.invalid) return;
    this.headerService.changeProjectName(this.nameControl.value || '');
    this.onSave();
    this.editMode.update(() => false);
  }

  onCancelChangeName() {
    const projectInfo = this.headerService.getProjectInfo();
    this.nameControl.setValue(projectInfo?.name || 'Untitled Project');
    this.editMode.update(() => false);
  }

  onPrintRoot() {
    this.headerService.printRootNode();
  }

  onSave() {
    const projectInfo = this.headerService.getProjectInfo();
    if (!projectInfo) return;
    if (projectInfo.id) {
      this.headerService.updateProject().subscribe((res) => {
        if (res && res.data) {
          const { _id, name } = res.data;
          this.headerService.setProjectInfo({ id: _id, name });
        }
        console.log('Project updated successfully:', res);
      });
      return;
    }
    this.headerService.createProject().subscribe((res) => {
      if (res && res.data) {
        const { _id, name } = res.data;
        this.headerService.setProjectInfo({ id: _id, name });
        this.snackbar.open(res.message, 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
        });
      }
    });
  }

  onCreate() {
    this.headerService.setProjectInfo({
      name: 'Untitled Project',
      id: undefined,
    });
    this.nameControl.setValue('Untitled Project');
    this.headerService.resetProject();
  }

  onBuild() {
    this.headerService.buildProject().subscribe((res) => {
      if (res) {
        console.log('Build started successfully');
      }
    });
  }
  onProjectStatus() {
    this.headerService.getProjectStatus().subscribe((res) => {
      if (res) {
        console.log('Project status:', res.status);
      }
    });
  }

  onDownload() {
    this.headerService.downloadProject();
  }

  onPreview() {
    this.headerService.openPreview();
  }

  onToggleMenu() {
    this.toggleLeftSideBar.emit();
  }

  onCheckList() {
    this.headerService
      .allProjects()
      .pipe(
        switchMap((res) => {
          let dialogConfig = new MatDialogConfig();
          dialogConfig = {
            ...dialogConfig,
            width: '600px',
            height: '400px',
            panelClass: 'project-list-card',
            autoFocus: false,
            data: res?.data,
          };
          if (res && res.data) {
            return this.dialog
              .open(ProjectListComponent, dialogConfig)
              .afterClosed();
          } else {
            return of(null);
          }
        }),
        switchMap((project) => {
          if (project) {
            this.loadingService.pageRefresh();
            return this.headerService.loadProject(project.id);
          }
          return of(null);
        })
      )
      .subscribe((message) => {
        const projectInfo = this.headerService.getProjectInfo();
        this.nameControl.setValue(projectInfo?.name || 'Untitled Project');
        if (message) {
          this.snackbar.open(message, 'Close', {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
        }
      });
  }
}
