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
        <div>
          <span class="eyebrow">Analysis Result</span>
          <h1>{{ analysis.fileName }}</h1>
          <p>{{ analysis.summary }}</p>
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
    .page{max-width:1200px;margin:0 auto;padding:1rem 2rem 4rem}
    .analysis-hero{display:grid;grid-template-columns:1.25fr .75fr;gap:1.25rem;margin-bottom:1.5rem}
    .analysis-hero>div{padding:2rem;border-radius:30px;background:rgba(255,255,255,.86);box-shadow:0 18px 60px rgba(8,32,50,.08)}
    .eyebrow{display:inline-block;margin-bottom:.7rem;color:#1f8a70;font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:.8rem}
    h1{margin:0 0 .75rem;font-family:var(--font-display);font-size:clamp(2rem,3vw,3.25rem)}
    p{color:var(--muted)}
    .score-panel{display:grid;align-content:center;gap:1rem}
    .score-ring{width:164px;height:164px;border-radius:50%;margin:0 auto;display:grid;place-items:center;background:radial-gradient(circle at top,#b7e4c7,#1f8a70);color:#082032;font-family:var(--font-display)}
    .score-ring span{font-size:3.4rem;line-height:1}
    .analysis-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem}
    mat-card{border-radius:24px;padding:1rem}
    .stack-list{display:grid;gap:.85rem}
    .suggestion{padding:1rem;border-radius:18px;background:rgba(183,228,199,.28)}
    .feedback{margin-top:1rem}
    .stamp{font-size:.88rem}
    @media (max-width:900px){.analysis-hero{grid-template-columns:1fr}.page{padding:1rem 1rem 3rem}}
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
