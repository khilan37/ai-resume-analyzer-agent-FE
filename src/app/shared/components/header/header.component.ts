import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <a routerLink="/" class="brand">
        <span class="brand-mark">SR</span>
        <div>
          <strong>Smart Resume Analyzer Agent</strong>
          <span>Angular + .NET + Gemini</span>
        </div>
      </a>

      <nav class="topnav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
        <a routerLink="/upload" routerLinkActive="active">Upload Resume</a>
      </nav>
    </header>
  `,
  styles: [`
    .topbar{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2rem;max-width:1200px;margin:0 auto}
    .brand{display:flex;gap:1rem;align-items:center;color:inherit;text-decoration:none}
    .brand-mark{display:grid;place-items:center;width:48px;height:48px;border-radius:16px;background:linear-gradient(135deg,#1f8a70,#b7e4c7);font-weight:800;color:#082032}
    .brand strong,.brand span{display:block}
    .brand span{color:var(--muted);font-size:.88rem}
    .topnav{display:flex;gap:1rem}
    .topnav a{padding:.65rem 1rem;border-radius:999px;text-decoration:none;color:var(--muted);transition:.2s ease}
    .topnav a.active,.topnav a:hover{background:rgba(31,138,112,.12);color:var(--foreground)}
    @media (max-width:760px){.topbar{padding:1rem;flex-direction:column;align-items:flex-start;gap:1rem}.topnav{width:100%;overflow:auto}}
  `]
})
export class HeaderComponent {}
