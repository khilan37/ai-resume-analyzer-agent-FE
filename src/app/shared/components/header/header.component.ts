import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <a routerLink="/" class="brand">
        <span class="brand-mark" aria-hidden="true">SR</span>
        <div>
          <strong>Smart Resume Analyzer Agent</strong>
          <span>Angular + .NET + Gemini</span>
        </div>
      </a>

      <nav class="topnav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
        <a routerLink="/upload" routerLinkActive="active">Upload Resume</a>
        <a routerLink="/auth" routerLinkActive="active" *ngIf="!isAuthenticated()">Login / Register</a>
        <button type="button" class="logout-btn" *ngIf="isAuthenticated()" (click)="logout()">Logout</button>
      </nav>
    </header>
  `,
  styles: [`
    .topbar{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2rem;max-width:1200px;margin:0 auto}
    .brand{display:flex;gap:1rem;align-items:center;color:inherit;text-decoration:none}
    .brand-mark{display:grid;place-items:center;flex:0 0 auto;width:72px;height:72px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#e7fff4 0%,#a3e7cb 42%,#5fc4a1 70%,#2e8f74 100%);box-shadow:0 12px 28px rgba(31,138,112,.2), inset 0 2px 10px rgba(255,255,255,.45);font-family:Georgia,'Times New Roman',serif;font-weight:700;font-size:1.65rem;line-height:1;color:#174b46;letter-spacing:-.08em;text-align:center;padding-bottom:2px}
    .brand strong,.brand span{display:block}
    .brand strong{font-size:1.1rem}
    .brand span{color:var(--muted);font-size:.88rem}
    .topnav{display:flex;gap:1rem}
    .topnav a,.logout-btn{padding:.65rem 1rem;border-radius:999px;text-decoration:none;color:var(--muted);transition:.2s ease;background:transparent;border:0;font:inherit;cursor:pointer}
    .topnav a.active,.topnav a:hover{background:rgba(31,138,112,.12);color:var(--foreground)}
    .logout-btn:hover{background:rgba(31,138,112,.12);color:var(--foreground)}
    @media (max-width:760px){.topbar{padding:1rem;flex-direction:column;align-items:flex-start;gap:1rem}.topnav{width:100%;overflow:auto}}
  `]
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  logout(): void {
    this.authService.logout();
  }
}
