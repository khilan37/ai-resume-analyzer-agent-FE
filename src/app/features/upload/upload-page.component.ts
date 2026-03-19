import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { ResumeApiService } from '../../core/services/resume-api.service';
import { LoadingOverlayComponent } from '../../shared/components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, LoadingOverlayComponent],
  template: `
    <app-loading-overlay [visible]="isSubmitting"></app-loading-overlay>

    <main class="page">
      <section class="upload-panel">
        <div class="panel-copy">
          <span class="eyebrow">Resume Intake</span>
          <h1>Upload a resume and get a structured AI review.</h1>
          <p>Accepted formats: PDF and DOCX. Add an optional target role for missing-skill detection and role matching.</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="upload-form">
          <button type="button" class="dropzone" (click)="filePicker.click()" (dragover)="allowDrop($event)" (drop)="onDrop($event)">
            <mat-icon>upload_file</mat-icon>
            <strong>{{ selectedFile?.name || 'Drag and drop resume here' }}</strong>
            <span>{{ selectedFile ? 'Click to replace file' : 'or click to browse from your device' }}</span>
          </button>

          <input #filePicker type="file" hidden accept=".pdf,.docx" (change)="onFileSelected($event)">

          <mat-form-field appearance="outline">
            <mat-label>Target Job Role</mat-label>
            <input matInput formControlName="jobRole" placeholder=".NET Developer, Data Analyst, Backend Engineer">
          </mat-form-field>

          <div class="actions">
            <button mat-stroked-button type="button" (click)="clear()">Clear</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="!selectedFile || isSubmitting">Analyze Resume</button>
          </div>
        </form>
      </section>
    </main>
  `,
  styles: [`
    .page{max-width:980px;margin:0 auto;padding:1rem 2rem 4rem}
    .upload-panel{display:grid;gap:1.5rem;padding:2rem;border-radius:36px;background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(240,248,245,.98));box-shadow:0 25px 80px rgba(8,32,50,.09)}
    .panel-copy h1{margin:.6rem 0;font-size:clamp(2rem,4vw,3.6rem);line-height:1;font-family:var(--font-display)}
    .panel-copy p,.eyebrow{color:var(--muted)}
    .eyebrow{font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:.78rem}
    .upload-form{display:grid;gap:1.25rem}
    .dropzone{display:grid;place-items:center;gap:.6rem;padding:2.5rem;border-radius:28px;border:2px dashed rgba(31,138,112,.35);background:linear-gradient(135deg,rgba(183,228,199,.35),rgba(255,255,255,.7));cursor:pointer;transition:.2s ease}
    .dropzone:hover{transform:translateY(-2px);border-color:#1f8a70}
    .dropzone mat-icon{transform:scale(1.4)}
    .actions{display:flex;justify-content:flex-end;gap:1rem}
    @media (max-width:760px){.page{padding:1rem 1rem 3rem}.upload-panel{padding:1.25rem}.actions{justify-content:stretch;flex-direction:column}}
  `]
})
export class UploadPageComponent {
  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef<HTMLInputElement>;

  private readonly formBuilder = inject(FormBuilder);
  private readonly resumeApiService = inject(ResumeApiService);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.group({
    jobRole: ['']
  });

  selectedFile: File | null = null;
  isSubmitting = false;

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
  }

  submit(): void {
    if (!this.selectedFile) {
      return;
    }

    this.isSubmitting = true;
    const jobRole = this.form.controls.jobRole.value ?? '';

    this.resumeApiService
      .uploadResume(this.selectedFile, jobRole)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response) => this.router.navigate(['/analysis', response.resumeId]),
        error: (error) => console.error('Upload failed', error)
      });
  }
}
