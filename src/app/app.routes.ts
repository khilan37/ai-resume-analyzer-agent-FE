import { Routes } from '@angular/router';
import { AuthPageComponent } from './features/auth/auth-page.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { UploadPageComponent } from './features/upload/upload-page.component';
import { AnalysisPageComponent } from './features/analysis/analysis-page.component';

export const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'upload', component: UploadPageComponent },
  { path: 'analysis/:id', component: AnalysisPageComponent },
  { path: '**', redirectTo: '' }
];
