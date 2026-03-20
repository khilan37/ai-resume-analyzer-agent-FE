import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResumeApiService } from '../../core/services/resume-api.service';

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, MatCardModule, MatChipsModule, MatProgressBarModule],
  template: `
    <main class="page" *ngIf="analysis$ | async as analysis">
      <section class="analysis-hero">
        <div class="hero-copy">
          <span class="eyebrow">Analysis Result</span>
          <h1>{{ analysis.fileName }}</h1>
          <p>{{ analysis.summary }}</p>
          <div class="hero-tags">
            <span>{{ analysis.jobRole || 'General multi-role analysis' }}</span>
            <span>AI-generated recommendations</span>
          </div>
        </div>
        <div class="score-panel">
          <div class="score-ring">
            <span>{{ analysis.score }}</span>
            <small>/100</small>
          </div>
          <mat-progress-bar mode="determinate" [value]="analysis.score"></mat-progress-bar>
          <p>{{ analysis.jobRole || 'General multi-role analysis' }}</p>
        </div>
      </section>

      <section class="analysis-grid">
        <mat-card>
          <mat-card-title>Extracted Skills</mat-card-title>
          <mat-card-content>
            <mat-chip-set>
              <mat-chip *ngFor="let item of analysis.skills">{{ item }}</mat-chip>
            </mat-chip-set>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Missing Skills</mat-card-title>
          <mat-card-content>
            <mat-chip-set>
              <mat-chip *ngFor="let item of analysis.missingSkills">{{ item }}</mat-chip>
            </mat-chip-set>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Improvement Suggestions</mat-card-title>
          <mat-card-content>
            <div class="stack-list">
              <article class="suggestion" *ngFor="let item of analysis.suggestions">{{ item }}</article>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-title>Role Matching</mat-card-title>
          <mat-card-content>
            <mat-chip-set>
              <mat-chip *ngFor="let item of analysis.matchedJobRoles">{{ item }}</mat-chip>
            </mat-chip-set>
            <p class="feedback">{{ analysis.overallFeedback }}</p>
            <p class="stamp">Generated {{ analysis.createdAtUtc | date:'medium' }}</p>
          </mat-card-content>
        </mat-card>
      </section>
    </main>
  `,
  styles: [`
    .page{max-width:1240px;margin:0 auto;padding:1rem 2rem 4rem}
    .analysis-hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(290px,.85fr);gap:1.25rem;margin-bottom:1.5rem}
    .analysis-hero>div{padding:2rem;border-radius:32px;background:rgba(255,255,255,.8);box-shadow:var(--shadow-md);border:1px solid rgba(16,35,28,.08);backdrop-filter:blur(16px)}
    .hero-copy{position:relative;overflow:hidden}
    .hero-copy::after{content:'';position:absolute;right:-30px;top:-45px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(29,107,87,.14),transparent 68%)}
    .eyebrow{display:inline-block;margin-bottom:.8rem;color:var(--primary);font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:.8rem}
    h1{margin:0 0 .85rem;font-family:var(--font-display);font-size:clamp(2rem,3vw,3.5rem);line-height:.96}
    p{color:var(--muted);line-height:1.65}
    .hero-tags{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.25rem}
    .hero-tags span{padding:.55rem .85rem;border-radius:999px;background:rgba(29,107,87,.08);border:1px solid rgba(29,107,87,.12);font-size:.88rem;color:var(--primary-strong)}
    .score-panel{display:grid;align-content:center;gap:1rem;text-align:center}
    .score-ring{width:176px;height:176px;border-radius:50%;margin:0 auto;display:grid;place-items:center;background:radial-gradient(circle at 30% 20%,#fff1d7 0%,#cde6d7 36%,#1d6b57 100%);color:#14352d;font-family:var(--font-display);box-shadow:inset 0 2px 10px rgba(255,255,255,.4)}
    .score-ring span{font-size:3.7rem;line-height:1}
    .analysis-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem}
    mat-card{border-radius:28px;padding:1rem;border:1px solid rgba(16,35,28,.08)}
    mat-card-title{font-family:var(--font-display);font-size:1.35rem}
    .stack-list{display:grid;gap:.85rem}
    .suggestion{padding:1rem;border-radius:18px;background:rgba(207,230,215,.45);border:1px solid rgba(29,107,87,.08);line-height:1.55}
    .feedback{margin-top:1rem}
    .stamp{font-size:.88rem}
    @media (max-width:900px){
      .analysis-hero{grid-template-columns:1fr}
      .page{padding:1rem 1rem 3rem}
    }
    @media (max-width:640px){
      .analysis-hero>div{padding:1.2rem}
      .score-ring{width:150px;height:150px}
      .score-ring span{font-size:3rem}
    }
  `]
})
export class AnalysisPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly resumeApiService = inject(ResumeApiService);

  readonly analysis$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((id) => this.resumeApiService.getAnalysis(id))
  );
}
