import { Routes } from '@angular/router';
import { PreviewComponent } from './page/preview/preview.component';
import { BuilderToolComponent } from './page/builder-tool/builder-tool.component';

export const routes: Routes = [
  {
    path: 'preview',
    component: PreviewComponent,
  },
  {
    path: 'builder',
    component: BuilderToolComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'builder',
  },
];
