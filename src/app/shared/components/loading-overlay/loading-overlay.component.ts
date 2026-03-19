import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loading-shell" *ngIf="visible">
      <mat-spinner diameter="54"></mat-spinner>
      <p>{{ label }}</p>
    </div>
  `,
  styles: [`
    .loading-shell{position:fixed;inset:0;background:rgba(8,32,50,.32);backdrop-filter:blur(10px);display:grid;place-items:center;z-index:1000}
    .loading-shell p{margin-top:1rem;color:#fff;font-weight:600}
  `]
})
export class LoadingOverlayComponent {
  @Input() visible = false;
  @Input() label = 'Analyzing resume with Gemini AI...';
}
