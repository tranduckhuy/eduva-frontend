import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validates that the password meets all required complexity rules:
 * - Length between 8 and 18 characters
 * - Contains at least one lowercase letter
 * - Contains at least one uppercase letter
 * - Contains at least one numeric digit
 * - Contains at least one special character
 *
 * Returns specific validation errors if conditions are not met.
 */
export function strongPasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value: string = control.value ?? '';
  const errors: ValidationErrors = {};

  if (value.length < 8) errors['passTooShort'] = true;
  if (value.length > 18) errors['passTooLong'] = true;
  if (!/[a-z]/.test(value)) errors['missingLowercase'] = true;
  if (!/[A-Z]/.test(value)) errors['missingUppercase'] = true;
  if (!/\d/.test(value)) errors['missingNumber'] = true;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
    errors['missingSpecialChar'] = true;

  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Validates whether the control's value matches a given password string.
 *
 * Commonly used for confirm password fields.
 *
 * @param control - The form control containing the confirm password string.
 * @param newPassword - The original password string to match against.
 * @returns An object with the key 'passwordMismatch' if values do not match, otherwise null.
 */
export function matchPasswordValidator(
  control: AbstractControl,
  newPassword: string
): { [key: string]: boolean } | null {
  return control.value === newPassword ? null : { passMismatch: true };
}

/**
 * Validates whether the control's value contains at least a specified number of words.
 *
 * Useful for validating free-text fields like descriptions or titles.
 *
 * @param control - The form control containing the string to validate.
 * @param minWords - The minimum number of words required.
 * @returns An object with the key 'minWords' if the word count is insufficient, otherwise null.
 */
export function minWordCountValidator(
  control: AbstractControl,
  minWords: number
): { [key: string]: boolean } | null {
  const wordCount = (control.value ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return wordCount >= minWords ? null : { minWords: true };
}

/**
 * Validates whether the control's value is a valid email address.
 *
 * Uses a stricter regex than Angular's built-in Validators.email.
 *
 * @param control - The form control containing the email string.
 * @returns An object with the key 'email' if invalid, otherwise null.
 */
export function customEmailValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value: string = control.value ?? '';
  // RFC 5322 Official Standard (simplified)
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!value) return null;
  return EMAIL_REGEX.test(value) ? null : { email: true };
}

/**
 * Validates that the control value is not only spaces.
 *
 * This validator checks if a string contains only whitespace characters
 * (spaces, tabs, newlines) and returns an error if so. It's useful for
 * preventing users from submitting forms with only spaces.
 *
 * Note: This validator does NOT check for empty strings - use Validators.required
 * for that purpose.
 *
 * @param control - The form control containing the string to validate
 * @returns ValidationErrors object with 'onlySpaces' key if value is only spaces, or null if valid
 */
export function noOnlySpacesValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (typeof value === 'string' && value.trim().length === 0) {
    return { onlySpaces: true };
  }

  return null;
}

/**
 * Validator function that checks if a form control value contains only letters, spaces, and Vietnamese diacritics.
 *
 * This validator is specifically designed for name fields (firstName, lastName) to ensure they only contain
 * valid characters and no special characters or numbers.
 *
 * @param control - The form control to validate
 * @returns ValidationErrors | null - Returns an error object if validation fails, null if validation passes
 */
export function noSpecialCharactersOrNumbersValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  if (typeof value === 'string' && value.length > 0) {
    const validNameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

    if (!validNameRegex.test(value)) {
      return { noSpecialCharactersOrNumbers: true };
    }
  }

  return null;
}
