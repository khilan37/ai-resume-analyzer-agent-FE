import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="loading-shell" *ngIf="visible">
      <div class="loading-card">
        <div class="gemini-badge">
          <svg class="gemini-mark" viewBox="0 0 96 96" aria-hidden="true">
            <defs>
              <linearGradient id="geminiGradient" x1="16" y1="14" x2="77" y2="82" gradientUnits="userSpaceOnUse">
                <stop stop-color="#8E7CFF"></stop>
                <stop offset="0.48" stop-color="#53C8FF"></stop>
                <stop offset="1" stop-color="#59F1C2"></stop>
              </linearGradient>
            </defs>
            <path d="M48 8C51.335 28.444 67.556 44.665 88 48C67.556 51.335 51.335 67.556 48 88C44.665 67.556 28.444 51.335 8 48C28.444 44.665 44.665 28.444 48 8Z" fill="url(#geminiGradient)"></path>
          </svg>
          <span class="pulse-ring"></span>
        </div>
        <h3>Analyzing resume with Gemini AI...</h3>
        <p>{{ label }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-shell{position:fixed;inset:0;background:rgba(8,32,50,.32);backdrop-filter:blur(10px);display:grid;place-items:center;z-index:1000}
    .loading-card{min-width:320px;padding:2rem 2.25rem;border-radius:28px;background:linear-gradient(180deg,rgba(8,32,50,.92),rgba(18,65,88,.92));box-shadow:0 30px 80px rgba(8,32,50,.32);text-align:center;color:#fff}
    .gemini-badge{position:relative;display:grid;place-items:center;width:96px;height:96px;margin:0 auto 1rem}
    .gemini-mark{width:72px;height:72px;position:relative;z-index:1;animation:float 1.8s ease-in-out infinite}
    .pulse-ring{position:absolute;inset:8px;border-radius:50%;border:1px solid rgba(255,255,255,.28);animation:pulse 1.8s ease-out infinite}
    .loading-card h3{margin:0 0 .5rem;font-size:1.2rem;font-family:var(--font-display)}
    .loading-card p{margin:0;color:rgba(255,255,255,.78);font-weight:600}
    @keyframes pulse{0%{transform:scale(.82);opacity:.25}70%{transform:scale(1.15);opacity:.65}100%{transform:scale(1.2);opacity:0}}
    @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-6px) rotate(5deg)}}
  `]
})
export class LoadingOverlayComponent {
  @Input() visible = false;
  @Input() label = 'Gemini is extracting skills, scoring the resume, and generating role-based suggestions.';
}
