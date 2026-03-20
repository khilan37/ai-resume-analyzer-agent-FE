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
    .hero{display:grid;grid-template-columns:minmax(0,1.18fr) minmax(300px,.82fr);gap:1.5rem;align-items:stretch}
    .hero-copy{position:relative;padding:2.25rem;border-radius:36px;background:linear-gradient(145deg,rgba(255,255,255,.84),rgba(207,230,215,.7));backdrop-filter:blur(16px);box-shadow:var(--shadow-lg);overflow:hidden}
    .hero-copy::after{content:'';position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(241,185,107,.22),transparent 70%)}
    .eyebrow{display:inline-block;padding:.5rem .9rem;border-radius:999px;background:rgba(255,255,255,.82);border:1px solid rgba(16,35,28,.08);font-size:.82rem;color:var(--primary);font-weight:700;letter-spacing:.06em;text-transform:uppercase}
    h1{position:relative;margin:1.1rem 0 .9rem;font-size:clamp(2.5rem,5vw,4.8rem);line-height:.92;font-family:var(--font-display);max-width:10ch}
    p{position:relative;margin:0;max-width:58ch;color:var(--muted);font-size:1.05rem;line-height:1.65}
    .hero-card{position:relative;overflow:hidden;border-radius:36px;padding:1.8rem;background:linear-gradient(155deg,#12362f 0%,#1d6b57 55%,#3c8f75 100%);color:#f5fff8;box-shadow:0 30px 80px rgba(16,35,28,.24)}
    .hero-card::before{content:'';position:absolute;inset:0;border:1px solid rgba(255,255,255,.12);border-radius:inherit}
    .hero-glow{position:absolute;inset:auto -10% -30% auto;width:260px;height:260px;background:radial-gradient(circle,rgba(255,255,255,.28),transparent 70%)}
    @media (max-width:900px){
      .hero{grid-template-columns:1fr}
      h1{max-width:12ch}
    }
    @media (max-width:640px){
      .hero-copy,.hero-card{padding:1.4rem;border-radius:28px}
      h1{font-size:clamp(2.1rem,11vw,3.4rem)}
      p{font-size:.98rem}
    }
  `]
})
export class HeroComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() subtitle = '';
}
