import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { LoadingService } from '../../../../shared/services/core/loading/loading.service';
import { QuestionService } from '../services/question.service';

import { RichTextEditorComponent } from '../../../../shared/components/rich-text-editor/rich-text-editor.component';

import { type CreateQuestionRequest } from '../model/request/command/create-question-request.model';

@Component({
  selector: 'new-question',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    RichTextEditorComponent,
  ],
  templateUrl: './new-question.component.html',
  styleUrl: './new-question.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewQuestionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly loadingService = inject(LoadingService);
  private readonly questionService = inject(QuestionService);

  materialId = input.required<string>();

  createQuestionSuccess = output<void>();

  form: FormGroup;

  isLoading = this.loadingService.isLoading;

  invalid = signal<boolean>(false);
  description = signal<string>('');

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  get title() {
    return this.form.get('title');
  }

  get content() {
    return this.form.get('content');
  }

  getContent(content: string) {
    this.form.get('content')?.patchValue(content);
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) return 'Trường này không được để trống';
    return '';
  }

  onSubmit() {
    this.form.markAllAsTouched();
    const lessonMaterialId = this.materialId();
    const title = this.title?.value;
    const content = this.content?.value;

    if (this.form.invalid || !title || !content) {
      this.invalid.set(true);
      return;
    }

    const request: CreateQuestionRequest = {
      lessonMaterialId,
      title,
      content,
    };
    this.questionService.createQuestion(request).subscribe({
      next: () => this.createQuestionSuccess.emit(),
    });
  }
}
