import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormControlComponent),
      multi: true,
    },
  ],
})
export class FormControlComponent implements ControlValueAccessor, OnInit {
  name = input<string>('');
  label = input<string>('');
  type = input<string>('text');
  placeholder = input<string>('');
  maxLength = input<number>(50);
  minLength = input<number>(0);
  minWords = input<number>(0);
  email = input<boolean>(false);
  required = input<boolean>(false);
  pattern = input<string | RegExp | null>(null);
  errorMessages = input<{ [key: string]: string }>({});
  validatePassword = input<boolean>(false);
  confirmPassword = input<string | null>(null);

  value = signal<string>('');
  isShowPassword = signal<boolean>(false);
  control = new FormControl('');

  toggleShowPassword(): void {
    this.isShowPassword.set(!this.isShowPassword());
  }

  readonly inputType = computed(() => {
    if (this.type() === 'password') {
      return this.isShowPassword() ? 'text' : 'password';
    }
    return this.type();
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  handleTouched(): void {
    this.control.markAsTouched();
    this.onTouched();
  }

  ngOnInit() {
    const validators = [];

    if (this.required()) {
      validators.push(Validators.required);
    }

    if (this.pattern()) {
      validators.push(Validators.pattern(this.pattern()!));
    }

    if (this.email()) {
      validators.push(Validators.email);
    }

    if (this.minWords() > 0) {
      validators.push((control: AbstractControl) =>
        minWords(control, this.minWords())
      );
    }

    if (this.maxLength()) {
      validators.push(Validators.maxLength(this.maxLength()));
    }

    if (this.minLength()) {
      validators.push(Validators.minLength(this.minLength()));
    }

    if (this.validatePassword()) {
      validators.push(validatePassword);
    }

    if (this.confirmPassword() !== null) {
      validators.push((control: AbstractControl) =>
        confirmPasswordValidator(control, this.confirmPassword()!)
      );
    }

    this.control.setValidators(validators);

    this.control.valueChanges.subscribe(value => {
      this.onChange(value !== null ? value : '');
      this.onTouched();
    });
  }

  writeValue(value: string): void {
    this.control.setValue(value || '', { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  get errorMessage(): string | null {
    if (this.control.errors && (this.control.touched || this.control.dirty)) {
      const firstError = Object.keys(this.control.errors)[0];
      return (
        this.errorMessages()[firstError] ||
        this.getDefaultErrorMessage(firstError)
      );
    }
    return null;
  }

  private getDefaultErrorMessage(error: string): string {
    switch (error) {
      case 'required':
        return 'Trường này không được để trống';
      case 'pattern':
        return 'Invalid format';
      case 'maxlength':
        return `Tối đa chỉ được phép nhập ${this.maxLength} kí tự`;
      case 'minlength':
        return `Cần có ít nhât ${this.minLength} kí tự`;
      case 'email':
        return 'Email không hợp lệ';
      case 'minWords':
        return `Cần có ít nhât ${this.minWords} từ`;
      case 'validatePassword':
        return 'Độ khó mật khẩu chưa đạt yêu cầu';
      case 'passwordsNotMatching':
        return 'Mật khẩu không khớp';
      default:
        return 'Giá trị không hợp lệ';
    }
  }
}

function minWords(
  control: AbstractControl,
  minWords: number
): { [key: string]: boolean } | null {
  const value = (control.value || '').trim();
  const words = value.split(/\s+/).filter((word: string) => word.length > 0);
  if (words.length >= minWords) {
    return null;
  }
  return { minWords: true };
}

function validatePassword(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const value = control.value || '';

  if (value.length < 8) {
    return { validatePassword: true };
  }

  const hasLowercase = /[a-z]/.test(value);
  const hasUppercase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const conditionsMet = [
    hasLowercase,
    hasUppercase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  if (conditionsMet >= 3) {
    return null;
  }

  return { passwordWeak: true };
}

function confirmPasswordValidator(
  control: AbstractControl,
  newPassword: string
): { [key: string]: boolean } | null {
  if (newPassword === control.value) {
    return null;
  }
  return { passwordsNotMatching: true };
}
