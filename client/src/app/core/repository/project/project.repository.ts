import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  AllProjectData,
  SaveProjectReq,
  SaveProjectRes,
} from './project.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectRepository {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:3000/api/project';

  onGetProject(id: string): Observable<SaveProjectRes | null> {
    return this.http
      .get<SaveProjectRes | null>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res));
  }

  onGetAllProjects(): Observable<AllProjectData> {
    return this.http.get<AllProjectData>(`${this.apiUrl}/all`);
  }

  onCreateProject(data: SaveProjectReq) {
    return this.http.post<SaveProjectRes>(`${this.apiUrl}`, data);
  }

  onUpdateProject(id: string, data: SaveProjectReq) {
    return this.http.put<SaveProjectRes>(`${this.apiUrl}/${id}`, data);
  }

  onBuildProject(id: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/build/${id}`, null);
  }

  onGetProjectStatus(id: string): Observable<{ status: string } | null> {
    return this.http.get<{ status: string } | null>(
      `${this.apiUrl}/status/${id}`
    );
  }

  onDownloadProject(id: string) {
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  onDeleteProject(id: string) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
