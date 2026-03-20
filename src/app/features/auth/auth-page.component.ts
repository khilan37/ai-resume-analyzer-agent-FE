import { NgIf } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  template: `
    <main class="page">
      <section class="auth-shell">
        <div class="auth-copy">
          <span class="eyebrow">Secure Access</span>
          <h1>Sign in before uploading or viewing resume analysis.</h1>
          <p>The backend protects resume APIs with JWT, so the UI needs login and registration to obtain a token first.</p>
          <div class="trust-points">
            <div>
              <strong>Protected workflows</strong>
              <span>Keep upload history, analysis retrieval, and future resume sessions behind authenticated access.</span>
            </div>
            <div>
              <strong>Fast handoff</strong>
              <span>Create an account once, then move straight into resume intake and analysis screens.</span>
            </div>
          </div>
        </div>

        <mat-card class="auth-card">
          <div class="tabs">
            <button type="button" [class.active]="mode() === 'login'" (click)="mode.set('login')">Login</button>
            <button type="button" [class.active]="mode() === 'register'" (click)="mode.set('register')">Register</button>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
            <mat-form-field appearance="outline" *ngIf="mode() === 'register'">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password">
            </mat-form-field>

            <p class="error" *ngIf="errorMessage()">{{ errorMessage() }}</p>

            <button mat-flat-button color="primary" type="submit" [disabled]="isSubmitting() || form.invalid">
              {{ mode() === 'login' ? 'Login' : 'Create Account' }}
            </button>
          </form>
        </mat-card>
      </section>
    </main>
  `,
  styles: [`
    .page{max-width:1160px;margin:0 auto;padding:1.5rem 2rem 4rem}
    .auth-shell{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,460px);gap:1.5rem;align-items:start}
    .auth-copy{padding:2.2rem;border-radius:36px;background:linear-gradient(160deg,rgba(255,255,255,.84),rgba(207,230,215,.72));box-shadow:var(--shadow-lg);border:1px solid rgba(16,35,28,.08)}
    .eyebrow{display:inline-block;color:var(--primary);font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:.78rem}
    h1{margin:.75rem 0 1rem;font-size:clamp(2.2rem,4vw,4rem);line-height:.95;font-family:var(--font-display)}
    p{margin:0;color:var(--muted);line-height:1.65}
    .trust-points{display:grid;gap:.95rem;margin-top:1.4rem}
    .trust-points div{padding:1rem 1.1rem;border-radius:22px;background:rgba(255,255,255,.56);border:1px solid rgba(16,35,28,.08)}
    .trust-points strong,.trust-points span{display:block}
    .trust-points span{margin-top:.35rem}
    .auth-card{border-radius:32px;padding:1.25rem;border:1px solid rgba(16,35,28,.08)}
    .tabs{display:flex;gap:.5rem;margin-bottom:1rem;padding:.3rem;border-radius:999px;background:rgba(29,107,87,.06)}
    .tabs button{flex:1;padding:.9rem 1rem;border:0;border-radius:999px;background:transparent;color:var(--muted);cursor:pointer;transition:background .2s ease,color .2s ease}
    .tabs button.active{background:var(--primary);color:#fff}
    .auth-form{display:grid;gap:1rem}
    .auth-form button[type='submit']{margin-top:.25rem}
    .error{color:var(--danger);font-size:.92rem}
    @media (max-width:900px){
      .auth-shell{grid-template-columns:1fr}
      .page{padding:1rem 1rem 3rem}
    }
  `]
})
export class AuthPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly mode = signal<'login' | 'register'>('login');
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly isRegisterMode = computed(() => this.mode() === 'register');

  readonly form = this.formBuilder.group({
    fullName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    this.errorMessage.set('');

    if (this.mode() === 'register') {
      this.form.controls.fullName.addValidators([Validators.required]);
      this.form.controls.fullName.updateValueAndValidity({ emitEvent: false });
    } else {
      this.form.controls.fullName.clearValidators();
      this.form.controls.fullName.updateValueAndValidity({ emitEvent: false });
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const request$ = this.mode() === 'login'
      ? this.authService.login({
          email: this.form.controls.email.value ?? '',
          password: this.form.controls.password.value ?? ''
        })
      : this.authService.register({
          fullName: this.form.controls.fullName.value ?? '',
          email: this.form.controls.email.value ?? '',
          password: this.form.controls.password.value ?? ''
        });

    request$
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (error) => {
          this.errorMessage.set(error?.error?.message ?? error?.error ?? 'Authentication failed.');
        }
      });
  }
}
