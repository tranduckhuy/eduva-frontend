import { effect, EffectRef, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { type NotificationPayloadMap } from '../../core/layout/header/user-actions/notifications/models/notification-payload-mapping.model';
import { type NotificationModel } from '../models/entities/notification.model';

/**
 * Checks whether the value and confirm value fields in a FormGroup do not match.
 *
 * @param form - The FormGroup containing the fields that need to check matching.
 * @param valueField - The name of the value field (default: 'newPassword').
 * @param confirmValueField - The name of the confirm value field (default: 'confirmPassword').
 * @returns `true` if the values do not match, otherwise `false`.
 */
export function isFormFieldMismatch(
  form: FormGroup,
  valueField: string = 'newPassword',
  confirmValueField: string = 'confirmPassword'
): boolean {
  const value: string | null | undefined = form.get(valueField)?.value;
  const confirmValue: string | null | undefined =
    form.get(confirmValueField)?.value;
  return value !== confirmValue;
}

/**
 * Subscribes to a signal and invokes a callback after a debounce delay when the signal's value changes.
 * Useful for search input, filtering, or any scenario where you want to reduce frequent signal emissions.
 *
 * @template T - The type of the signal's value.
 * @param signal - The signal to observe.
 * @param callback - The function to invoke after the debounce period with the latest value.
 * @param delay - The debounce delay in milliseconds (default is 300ms).
 * @returns A cleanup function that stops the effect and cancels the timer.
 */
export function debounceSignal<T>(
  signal: Signal<T>,
  callback: (value: T) => void,
  delay: number = 300
): () => void {
  let timer: any = null;
  let previousValue: T;

  const ref: EffectRef = effect(() => {
    const currentValue = signal();

    // ? Skip initial run
    if (currentValue === previousValue) return;
    previousValue = currentValue;

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback(currentValue), delay);
  });

  return () => {
    clearTimeout(timer);
    ref.destroy();
  };
}

/**
 * Casts the raw payload of a notification to its specific typed payload
 * based on the notification type, enabling type-safe access to payload properties.
 *
 * @template T - The specific key of the NotificationPayloadMap indicating the notification type.
 * @param raw - The original notification object with an untyped payload.
 * @returns A new notification object with the payload cast to its corresponding typed structure.
 */
export function mapNotificationPayload<T extends keyof NotificationPayloadMap>(
  raw: NotificationModel<any>
): NotificationModel<NotificationPayloadMap[T]> {
  const typedPayload = raw.payload as NotificationPayloadMap[T];

  return {
    ...raw,
    payload: typedPayload,
  };
}

/**
 * Removes specific query parameters from the current route URL without reloading the page.
 *
 * @param router - The Angular Router instance used to navigate.
 * @param activatedRoute - The current ActivatedRoute instance for relative navigation.
 * @param keys - An array of query parameter keys to be removed.
 */
export function clearQueryParams(
  router: Router,
  activatedRoute: ActivatedRoute,
  keys: string[]
): void {
  const queryParams: Record<string, null> = {};
  keys.forEach(key => (queryParams[key] = null));

  router.navigate([], {
    relativeTo: activatedRoute,
    queryParams,
    queryParamsHandling: 'merge',
    replaceUrl: true,
  });
}
