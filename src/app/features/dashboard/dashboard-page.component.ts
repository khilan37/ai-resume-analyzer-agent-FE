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
          <div class="metric-card">
            <strong>Skill extraction</strong>
            <span>Technical and domain skills mapped from each uploaded resume.</span>
          </div>
          <div class="metric-card">
            <strong>Role gap analysis</strong>
            <span>Missing skills and targeted suggestions for the selected role.</span>
          </div>
          <div class="hero-cta">
            <a mat-flat-button routerLink="/upload">Analyze New Resume</a>
            <p>Fast scan for PDF and DOCX resumes with structured scoring, job-role matching, and improvement guidance.</p>
          </div>
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
            <div class="card-orb" aria-hidden="true"></div>
            <div class="card-header-copy">
              <mat-card-title>{{ item.fileName }}</mat-card-title>
              <mat-card-subtitle>{{ item.jobRole || 'General role match' }}</mat-card-subtitle>
            </div>
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
    .page{max-width:1240px;margin:0 auto;padding:1rem 2rem 4rem}
    .hero-metrics{display:grid;gap:1rem}
    .metric-card{padding:1rem 1.1rem;border:1px solid rgba(255,255,255,.14);border-radius:24px;background:rgba(255,255,255,.08)}
    .hero-metrics strong,.hero-metrics span{display:block}
    .hero-metrics strong{font-size:1rem}
    .hero-metrics span{margin-top:.35rem;color:rgba(255,255,255,.8);line-height:1.5}
    .hero-cta{display:grid;gap:.9rem;padding-top:.25rem}
    .hero-cta p{margin:0;color:rgba(255,255,255,.74);font-size:.94rem;line-height:1.55}
    .section-head{display:flex;justify-content:space-between;align-items:end;gap:1rem;margin:2.25rem 0 1rem}
    .section-head h2{margin:0;font-family:var(--font-display);font-size:clamp(1.8rem,3vw,2.4rem)}
    .section-head p{margin:.35rem 0 0;color:var(--muted)}
    .history-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:1.25rem}
    .history-card{position:relative;border-radius:28px;padding:.4rem;overflow:hidden;border:1px solid var(--border)}
    .history-card::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.4),transparent 32%);pointer-events:none}
    mat-card-header{display:flex;align-items:center;gap:1rem;padding:1rem 1rem 0}
    .card-orb{width:48px;height:48px;border-radius:16px;background:linear-gradient(145deg,#f1b96b,#7fc4a8 60%,#1d6b57);box-shadow:inset 0 1px 8px rgba(255,255,255,.45)}
    .card-header-copy{min-width:0}
    .card-header-copy mat-card-title{font-size:1.05rem;line-height:1.3}
    .card-header-copy mat-card-subtitle{margin-top:.2rem}
    .score-row{display:flex;justify-content:space-between;align-items:center;gap:.75rem;margin-bottom:.7rem}
    .score-row strong{font-family:var(--font-display);font-size:1.3rem}
    .muted{color:var(--muted);margin:1rem 0;line-height:1.5}
    mat-card-actions{padding:0 1rem 1rem}
    @media (max-width:760px){
      .page{padding:1rem 1rem 3rem}
      .section-head{margin-top:1.5rem}
    }
  `]
})
export class DashboardPageComponent {
  private readonly resumeApiService = inject(ResumeApiService);
  readonly history$: Observable<ResumeHistoryItemResponse[]> = this.resumeApiService.getHistory();
}
