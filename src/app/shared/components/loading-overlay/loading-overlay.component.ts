import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [NgIf, MatProgressSpinnerModule],
  template: `
    <div class="loading-shell" *ngIf="visible">
      <div>
        <mat-spinner diameter="54"></mat-spinner>
        <p>{{ label }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-shell{position:fixed;inset:0;background:rgba(8,32,50,.32);backdrop-filter:blur(10px);display:grid;place-items:center;z-index:1000}
    .loading-shell p{margin-top:1rem;color:#fff;font-weight:600;text-align:center}
  `]
})
export class LoadingOverlayComponent {
  @Input() visible = false;
  @Input() label = 'Analyzing resume with Gemini AI...';
}
