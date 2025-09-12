import { inject, Injectable } from '@angular/core';
import { ProjectRepository } from '../../core/repository/project/project.repository';
import { ProjectService } from '../../core/service/project.service';
import { map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import {
  AllProjectData,
  SaveProjectRes,
} from '../../core/repository/project/project.model';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  projectRepository = inject(ProjectRepository);
  projectService = inject(ProjectService);
  router = inject(Router);

  printRootNode() {
    console.log(this.projectService.getRootNode());
  }

  allProjects(): Observable<AllProjectData> {
    return this.projectRepository.onGetAllProjects();
  }

  createProject(): Observable<SaveProjectRes | null> {
    const projectInfo = this.projectService.getProjectInfo();
    const rootNode = this.projectService.getRootNode();
    if (projectInfo && rootNode) {
      return this.projectRepository.onCreateProject({
        id: projectInfo.id,
        name: projectInfo.name,
        component: rootNode,
      });
    }
    return of(null);
  }

  updateProject(): Observable<SaveProjectRes | null> {
    const projectInfo = this.projectService.getProjectInfo();
    const rootNode = this.projectService.getRootNode();
    if (projectInfo && rootNode) {
      return this.projectRepository.onUpdateProject(projectInfo.id!, {
        id: projectInfo.id,
        name: projectInfo.name,
        component: rootNode,
      });
    }
    return of(null);
  }

  loadProject(id: string): Observable<string | null> {
    return this.projectRepository.onGetProject(id).pipe(
      map((res) => {
        if (res && res.data) {
          this.projectService.loadProject(res);

          return res.message;
        }
        return null;
      })
    );
  }

  buildProject(): Observable<boolean> {
    const projectInfo = this.projectService.getProjectInfo();
    if (projectInfo && projectInfo.id) {
      return this.projectRepository.onBuildProject(projectInfo.id);
    }
    return of(false);
  }

  getProjectInfo() {
    return this.projectService.getProjectInfo();
  }

  setProjectInfo(info: { id?: string; name: string }) {
    this.projectService.setProjectInfo(info);
  }

  getProjectStatus(): Observable<{ status: string } | null> {
    const projectInfo = this.projectService.getProjectInfo();
    if (projectInfo && projectInfo.id) {
      return this.projectRepository.onGetProjectStatus(projectInfo.id);
    }
    return of(null);
  }

  changeProjectName(name: string) {
    const projectInfo = this.projectService.getProjectInfo();
    this.projectService.setProjectInfo({
      ...projectInfo,
      name,
    });
  }

  openPreview() {
    const projectInfo = this.projectService.getProjectInfo();
    if (projectInfo && projectInfo.id) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/preview', projectInfo.id])
      );
      window.open(url, '_blank');
    }
  }

  downloadProject() {
    const projectInfo = this.projectService.getProjectInfo();
    if (projectInfo && projectInfo.id) {
      this.projectRepository
        .onDownloadProject(projectInfo.id)
        .pipe(
          map((response: HttpResponse<Blob>) => {
            // Get the Content-Disposition header
            const contentDisposition = response.headers.get(
              'Content-Disposition'
            );
            const filename =
              this.getFilenameFromContentDisposition(contentDisposition);

            // Return both the blob and the filename
            return {
              blob: response.body,
              filename: filename || 'default.zip',
            };
          })
        )
        .subscribe(
          (result) => {
            // Create a URL for the blob
            if (!result.blob) {
              console.error('No file received');
              return;
            }
            const url = window.URL.createObjectURL(result.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.filename;
            document.body.appendChild(a);
            a.click();
            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          },
          (error) => {
            console.error('Download error:', error);
          }
        );
    }
  }

  private getFilenameFromContentDisposition(
    disposition: string | null
  ): string | null {
    if (!disposition) {
      return null;
    }
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }
    return null;
  }
}
