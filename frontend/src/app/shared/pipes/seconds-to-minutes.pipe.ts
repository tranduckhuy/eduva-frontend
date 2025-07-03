import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToMinutes',
  standalone: true,
})
export class SecondsToMinutesPipe implements PipeTransform {
  transform(seconds: number | null | undefined): string {
    if (seconds == null || isNaN(seconds)) return '00:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const mm = mins.toString().padStart(2, '0');
    const ss = secs.toString().padStart(2, '0');

    return `${mm}:${ss}`;
  }
}
