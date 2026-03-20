import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ResumeApiService } from '../../core/services/resume-api.service';
import { LoadingOverlayComponent } from '../../shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, LoadingOverlayComponent],
  template: `
    <app-loading-overlay [visible]="isSubmitting"></app-loading-overlay>

    <main class="page">
      <section class="upload-panel">
        <div class="panel-copy">
          <span class="eyebrow">Resume Intake</span>
          <h1>Upload a resume and get a structured AI review.</h1>
          <p>Accepted formats: PDF and DOCX. Add an optional target role for missing-skill detection and role matching.</p>
          <div class="upload-highlights">
            <div>
              <strong>Instant structure</strong>
              <span>Resume summary, score, missing skills, and role-fit insights in one flow.</span>
            </div>
            <div>
              <strong>Role-aware feedback</strong>
              <span>Add a target role to get clearer recommendations and skill-gap direction.</span>
            </div>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="upload-form">
          <button type="button" class="dropzone" (click)="filePicker.click()" (dragover)="allowDrop($event)" (drop)="onDrop($event)">
            <div class="dropzone-icon">
              <mat-icon>upload_file</mat-icon>
            </div>
            <strong>{{ selectedFile?.name || 'Drag and drop resume here' }}</strong>
            <span>{{ selectedFile ? 'Click to replace file' : 'or click to browse from your device' }}</span>
            <small>Supported file types: PDF, DOCX</small>
          </button>

          <input #filePicker type="file" hidden accept=".pdf,.docx" (change)="onFileSelected($event)">

          <mat-form-field appearance="outline">
            <mat-label>Target Job Role</mat-label>
            <input matInput formControlName="jobRole" placeholder=".NET Developer, Data Analyst, Backend Engineer">
          </mat-form-field>

          <p class="guest-note" *ngIf="remainingGuestAttempts > 0 && !isAuthenticated">
            Guest uploads remaining: {{ remainingGuestAttempts }}
          </p>

          <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

          <div class="actions">
            <button mat-stroked-button type="button" (click)="clear()">Clear</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="!selectedFile || isSubmitting">Analyze Resume</button>
          </div>
        </form>
      </section>
    </main>
  `,
  styles: [`
    .page{max-width:1080px;margin:0 auto;padding:1rem 2rem 4rem}
    .upload-panel{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,.92fr);gap:1.5rem;padding:2rem;border-radius:38px;background:linear-gradient(180deg,rgba(255,255,255,.76),rgba(248,251,246,.96));backdrop-filter:blur(18px);box-shadow:var(--shadow-lg);border:1px solid rgba(16,35,28,.08)}
    .panel-copy{padding:1rem}
    .panel-copy h1{margin:.7rem 0 1rem;font-size:clamp(2.2rem,4vw,4rem);line-height:.95;font-family:var(--font-display)}
    .panel-copy p,.eyebrow{color:var(--muted)}
    .panel-copy p{line-height:1.65}
    .eyebrow{font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:.78rem}
    .upload-highlights{display:grid;gap:.9rem;margin-top:1.35rem}
    .upload-highlights div{padding:1rem 1.1rem;border-radius:22px;background:rgba(29,107,87,.05);border:1px solid rgba(29,107,87,.08)}
    .upload-highlights strong,.upload-highlights span{display:block}
    .upload-highlights span{margin-top:.35rem;line-height:1.55}
    .upload-form{display:grid;align-content:start;gap:1.1rem;padding:1.25rem;border-radius:30px;background:rgba(255,255,255,.76);border:1px solid rgba(16,35,28,.08)}
    .dropzone{display:grid;place-items:center;gap:.65rem;padding:2.25rem 1.25rem;border-radius:28px;border:2px dashed rgba(29,107,87,.28);background:linear-gradient(135deg,rgba(207,230,215,.55),rgba(255,255,255,.92));cursor:pointer;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease;text-align:center}
    .dropzone:hover{transform:translateY(-2px);border-color:var(--primary);box-shadow:0 18px 36px rgba(29,107,87,.12)}
    .dropzone strong{font-size:1.1rem;line-height:1.3}
    .dropzone span{color:var(--muted);line-height:1.5}
    .dropzone small{color:var(--muted);font-size:.85rem}
    .dropzone-icon{display:grid;place-items:center;width:72px;height:72px;border-radius:22px;background:linear-gradient(145deg,#fff6e8,#d8ecdf 45%,#7ebea3);color:var(--primary-strong);box-shadow:inset 0 1px 10px rgba(255,255,255,.5)}
    .dropzone mat-icon{transform:scale(1.55)}
    .guest-note{margin:0;color:var(--muted);font-size:.92rem;line-height:1.5}
    .error{margin:0;color:var(--danger);font-size:.92rem;line-height:1.5}
    .actions{display:flex;justify-content:flex-end;gap:.85rem;flex-wrap:wrap}
    .actions button{min-width:140px}
    @media (max-width:900px){
      .upload-panel{grid-template-columns:1fr}
    }
    @media (max-width:760px){
      .page{padding:1rem 1rem 3rem}
      .upload-panel{padding:1.1rem;border-radius:28px}
      .panel-copy,.upload-form{padding:1rem}
      .actions{justify-content:stretch;flex-direction:column}
      .actions button{width:100%}
    }
  `]
})
export class UploadPageComponent {
  @ViewChild('filePicker', { static: true }) fileInput!: ElementRef<HTMLInputElement>;

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly resumeApiService = inject(ResumeApiService);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.group({
    jobRole: ['']
  });

  selectedFile: File | null = null;
  isSubmitting = false;
  errorMessage = '';
  remainingGuestAttempts = this.resumeApiService.getRemainingGuestAttempts();
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files.item(0);
    if (file) {
      this.selectedFile = file;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.item(0) ?? null;
  }

  clear(): void {
    this.selectedFile = null;
    this.form.reset();
    this.fileInput.nativeElement.value = '';
    this.errorMessage = '';
  }

  submit(): void {
    if (!this.selectedFile) {
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;
    const jobRole = this.form.controls.jobRole.value ?? '';

    this.resumeApiService
      .uploadResume(this.selectedFile, jobRole)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response) => {
          this.remainingGuestAttempts = this.resumeApiService.getRemainingGuestAttempts();
          this.router.navigate(['/analysis', response.resumeId]);
        },
        error: (error) => {
          if (error instanceof Error && error.message === 'LOGIN_REQUIRED') {
            this.errorMessage = 'You have used 3 guest uploads. Please login or register to continue.';
          } else if (error?.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Resume upload failed. Please verify the backend is running and try again.';
          }
          this.remainingGuestAttempts = this.resumeApiService.getRemainingGuestAttempts();
          console.error('Upload failed', error);
        }
      });
  }
}
