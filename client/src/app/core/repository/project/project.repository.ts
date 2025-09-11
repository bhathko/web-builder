import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SaveProjectReq, SaveProjectRes } from './project.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectRepository {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:3000/api/project';

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
    return this.http.get<{ status: string } | null>(`${this.apiUrl}/status/${id}`);
  }

  onDownloadProject(id: string) {
    return this.http.get(`${this.apiUrl}/download/${id}`, {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
