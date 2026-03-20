import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ResumeAnalysisResponse, ResumeHistoryItemResponse } from '../models/resume.models';
import { AuthService } from './auth.service';

const GUEST_ANALYZE_LIMIT = 3;
const GUEST_ANALYZE_COUNT_KEY = 'smart-resume-guest-analyze-count';

@Injectable({ providedIn: 'root' })
export class ResumeApiService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  uploadResume(file: File, jobRole?: string): Observable<ResumeAnalysisResponse> {
    if (!this.authService.isAuthenticated() && this.getGuestAnalyzeCount() >= GUEST_ANALYZE_LIMIT) {
      return throwError(() => new Error('LOGIN_REQUIRED'));
    }

    const userId = this.authService.getCurrentUserId() ?? environment.demoUserId;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    if (jobRole?.trim()) {
      formData.append('jobRole', jobRole.trim());
    }

    return this.http.post<ResumeAnalysisResponse>(`${this.apiBaseUrl}/resumes/analyze`, formData).pipe(
      catchError((error) => throwError(() => error)),
      this.authService.isAuthenticated()
        ? (source) => source
        : (source) =>
            new Observable<ResumeAnalysisResponse>((observer) => {
              const subscription = source.subscribe({
                next: (value) => {
                  this.incrementGuestAnalyzeCount();
                  observer.next(value);
                },
                error: (error) => observer.error(error),
                complete: () => observer.complete()
              });

              return () => subscription.unsubscribe();
            })
    );
  }

  getAnalysis(resumeId: string): Observable<ResumeAnalysisResponse> {
    return this.http.get<ResumeAnalysisResponse>(`${this.apiBaseUrl}/resumes/${resumeId}`);
  }

  getHistory(): Observable<ResumeHistoryItemResponse[]> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return of([]);
    }

    return this.http
      .get<ResumeHistoryItemResponse[]>(`${this.apiBaseUrl}/resumes/history/${userId}`)
      .pipe(catchError(() => of([])));
  }

  getRemainingGuestAttempts(): number {
    return Math.max(0, GUEST_ANALYZE_LIMIT - this.getGuestAnalyzeCount());
  }

  private getGuestAnalyzeCount(): number {
    const raw = localStorage.getItem(GUEST_ANALYZE_COUNT_KEY);
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private incrementGuestAnalyzeCount(): void {
    localStorage.setItem(GUEST_ANALYZE_COUNT_KEY, String(this.getGuestAnalyzeCount() + 1));
  }
}
