import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Observable } from 'rxjs';
import { ResumeHistoryItemResponse } from '../../core/models/resume.models';
import { ResumeApiService } from '../../core/services/resume-api.service';
import { HeroComponent } from '../../shared/components/hero/hero.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, RouterLink, MatButtonModule, MatCardModule, MatChipsModule, MatProgressBarModule, HeroComponent],
  template: `
    <main class="page">
      <app-hero
        eyebrow="AI Resume Intelligence"
        title="See resume strengths, gaps, and role fit in one view."
        subtitle="Upload a PDF or DOCX, send it through Gemini, and visualize structured analysis from the .NET backend.">
        <div class="hero-metrics">
          <div>
            <strong>Skill extraction</strong>
            <span>Technical and domain skills mapped from each uploaded resume.</span>
          </div>
          <div>
            <strong>Role gap analysis</strong>
            <span>Missing skills and targeted suggestions for the selected role.</span>
          </div>
          <a mat-flat-button routerLink="/upload">Analyze New Resume</a>
        </div>
      </app-hero>

      <section class="section-head">
        <div>
          <h2>Recent Analyses</h2>
          <p>Resume history from the backend analysis store.</p>
        </div>
      </section>

      <section class="history-grid">
        <mat-card class="history-card" *ngFor="let item of history$ | async">
          <mat-card-header>
            <mat-card-title>{{ item.fileName }}</mat-card-title>
            <mat-card-subtitle>{{ item.jobRole || 'General role match' }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="score-row">
              <span>Resume Score</span>
              <strong>{{ item.score }}/100</strong>
            </div>
            <mat-progress-bar mode="determinate" [value]="item.score"></mat-progress-bar>
            <p class="muted">Uploaded {{ item.uploadedAtUtc | date:'medium' }}</p>
            <mat-chip-set>
              <mat-chip *ngFor="let skill of item.skills">{{ skill }}</mat-chip>
            </mat-chip-set>
          </mat-card-content>
          <mat-card-actions>
            <a mat-button color="primary" [routerLink]="['/analysis', item.resumeId]">Open Analysis</a>
          </mat-card-actions>
        </mat-card>
      </section>
    </main>
  `,
  styles: [`
    .page{max-width:1200px;margin:0 auto;padding:1rem 2rem 4rem}
    .hero-metrics{display:grid;gap:1.25rem}
    .hero-metrics div{padding:1rem 1.1rem;border:1px solid rgba(255,255,255,.15);border-radius:22px;background:rgba(255,255,255,.06)}
    .hero-metrics strong,.hero-metrics span{display:block}
    .hero-metrics span{margin-top:.35rem;color:rgba(255,255,255,.78)}
    .section-head{display:flex;justify-content:space-between;align-items:end;margin:2rem 0 1rem}
    .section-head h2{margin:0;font-family:var(--font-display);font-size:2rem}
    .section-head p{margin:.3rem 0 0;color:var(--muted)}
    .history-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem}
    .history-card{border-radius:24px}
    .score-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem}
    .muted{color:var(--muted);margin:1rem 0}
    @media (max-width:760px){.page{padding:1rem 1rem 3rem}}
  `]
})
export class DashboardPageComponent {
  private readonly resumeApiService = inject(ResumeApiService);
  readonly history$: Observable<ResumeHistoryItemResponse[]> = this.resumeApiService.getHistory();
}
