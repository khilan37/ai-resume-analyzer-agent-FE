import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResumeAnalysisResponse, ResumeHistoryItemResponse } from '../models/resume.models';

@Injectable({ providedIn: 'root' })
export class ResumeApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  uploadResume(file: File, jobRole?: string): Observable<ResumeAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', environment.demoUserId);

    if (jobRole?.trim()) {
      formData.append('jobRole', jobRole.trim());
    }

    return this.http.post<ResumeAnalysisResponse>(`${this.apiBaseUrl}/resumes/analyze`, formData);
  }

  getAnalysis(resumeId: string): Observable<ResumeAnalysisResponse> {
    return this.http.get<ResumeAnalysisResponse>(`${this.apiBaseUrl}/resumes/${resumeId}`);
  }

  getHistory(): Observable<ResumeHistoryItemResponse[]> {
    return this.http.get<ResumeHistoryItemResponse[]>(`${this.apiBaseUrl}/resumes/history/${environment.demoUserId}`);
  }
}
