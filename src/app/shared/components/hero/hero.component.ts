import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">{{ eyebrow }}</span>
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>
      <div class="hero-card">
        <div class="hero-glow"></div>
        <ng-content />
      </div>
    </section>
  `,
  styles: [`
    .hero{display:grid;grid-template-columns:1.2fr .8fr;gap:1.5rem;align-items:stretch}
    .hero-copy{padding:2rem;border-radius:32px;background:linear-gradient(160deg,rgba(183,228,199,.65),rgba(255,255,255,.9));backdrop-filter:blur(10px);box-shadow:0 25px 60px rgba(8,32,50,.08)}
    .eyebrow{display:inline-block;padding:.45rem .85rem;border-radius:999px;background:#ffffff;border:1px solid rgba(0,0,0,.08);font-size:.85rem;color:#1f8a70}
    h1{margin:1rem 0 .75rem;font-size:clamp(2.4rem,5vw,4.5rem);line-height:.95;font-family:var(--font-display)}
    p{margin:0;max-width:56ch;color:var(--muted);font-size:1.05rem}
    .hero-card{position:relative;overflow:hidden;border-radius:32px;padding:1.75rem;background:linear-gradient(140deg,#082032,#1f8a70);color:#f5fff8;box-shadow:0 30px 80px rgba(8,32,50,.22)}
    .hero-glow{position:absolute;inset:auto -10% -30% auto;width:240px;height:240px;background:radial-gradient(circle,rgba(255,255,255,.28),transparent 70%)}
    @media (max-width:900px){.hero{grid-template-columns:1fr}}
  `]
})
export class HeroComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() subtitle = '';
}
