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
    .topbar{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;padding:1rem 2rem;max-width:1240px;margin:0 auto}
    .topbar::before{content:'';position:absolute;inset:.4rem 1rem;border:1px solid rgba(16,35,28,.08);border-radius:28px;background:rgba(255,255,255,.62);backdrop-filter:blur(18px);box-shadow:0 12px 30px rgba(16,35,28,.08);z-index:-1}
    .brand{display:flex;gap:1rem;align-items:center;color:inherit;text-decoration:none;min-width:0}
    .brand-mark{display:inline-block;flex:0 0 auto;font-family:var(--font-display);font-weight:700;font-size:1.2rem;line-height:1;color:var(--primary);letter-spacing:-.08em}
    .brand strong,.brand span{display:block}
    .brand strong{font-size:1rem;line-height:1.15}
    .brand span{color:var(--muted);font-size:.84rem}
    .topnav{display:flex;align-items:center;justify-content:flex-end;gap:.55rem;flex-wrap:wrap}
    .topnav a,.logout-btn{padding:.7rem 1rem;border-radius:999px;text-decoration:none;color:var(--muted);transition:background .2s ease,color .2s ease,transform .2s ease;background:transparent;border:1px solid transparent;cursor:pointer}
    .topnav a.active,.topnav a:hover,.logout-btn:hover{background:rgba(29,107,87,.1);border-color:rgba(29,107,87,.14);color:var(--foreground);transform:translateY(-1px)}
    @media (max-width:860px){
      .topbar{padding:1rem;align-items:flex-start;flex-direction:column}
      .topbar::before{inset:.35rem .6rem}
      .topnav{width:100%;justify-content:flex-start}
    }
    @media (max-width:520px){
      .brand{align-items:flex-start}
      .brand-mark{font-size:1.06rem}
      .topnav a,.logout-btn{flex:1 1 calc(50% - .55rem);text-align:center}
    }
  `]
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  logout(): void {
    this.authService.logout();
  }
}
