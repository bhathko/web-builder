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
import { filter, map, Subscription } from 'rxjs';
import { ComponentService } from '../../core/service/component.service';
import { ProjectService } from '../../core/service/project.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderService } from './header.service';
import { SaveProjectRes } from '../../core/repository/project/project.model';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  headerService = inject(HeaderService);

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
      }

      console.log('Project created successfully:', res);
    });
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
}
