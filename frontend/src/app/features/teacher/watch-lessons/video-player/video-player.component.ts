import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';

import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faPlay,
  faPause,
  faRotateLeft,
  faRotateRight,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
  faGear,
  faExpand,
  faClosedCaptioning,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'video-player',
  standalone: true,
  imports: [FontAwesomeModule, VgCoreModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent {
  @ViewChild('progressBar') progressBarRef!: ElementRef<HTMLDivElement>;
  @ViewChild('volumeBar') volumeBarRef!: ElementRef<HTMLDivElement>;

  private vgApi = inject(VgApiService);
  private readonly iconLibrary = inject(FaIconLibrary);

  preload = signal<string>('metadata');
  isPaused = signal<boolean>(true);
  hasStarted = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  volumeLevel = signal<number>(1);
  playedProgress = signal<number>(0);
  bufferedProgress = signal<number>(0);

  showUiControls = computed(() => this.hasStarted());

  constructor() {
    this.iconLibrary.addIcons(
      faPlay,
      faPause,
      faRotateLeft,
      faRotateRight,
      faVolumeHigh,
      faVolumeLow,
      faVolumeXmark,
      faGear,
      faExpand,
      faClosedCaptioning
    );
  }

  onPlayerReady(api: VgApiService) {
    this.vgApi = api;
    const media = api.getDefaultMedia();

    media.subscriptions.loadedMetadata.subscribe(() => {
      this.duration.set(media.duration);
    });

    media.subscriptions.timeUpdate.subscribe(() => {
      const current = media.currentTime;
      const duration = media.duration;

      this.currentTime.set(current);
      this.playedProgress.set((current / duration) * 100);

      const buffer = (media as any).buffer as TimeRanges;
      if (buffer?.length) {
        const currentTime = media.currentTime;
        for (let i = 0; i < buffer.length; i++) {
          const start = buffer.start(i);
          const end = buffer.end(i);
          if (currentTime >= start && currentTime <= end) {
            const buffered = (end / media.duration) * 100;
            this.bufferedProgress.set(buffered);
            return;
          }
        }
        this.bufferedProgress.set((currentTime / media.duration) * 100);
      }
    });

    media.subscriptions.waiting.subscribe(() => this.isLoading.set(true));
    media.subscriptions.playing.subscribe(() => {
      this.isLoading.set(false);
      this.hasStarted.set(true);
      this.isPaused.set(false);
    });
    media.subscriptions.pause.subscribe(() => this.isPaused.set(true));
  }

  playVideo() {
    const video = this.getVideoElement();
    video.play();
    this.hasStarted.set(true);
  }

  pauseVideo() {
    this.getVideoElement().pause();
  }

  togglePlayPause() {
    const video = this.getVideoElement();
    video.paused ? video.play() : video.pause();
  }

  rewind(seconds = 10) {
    const media = this.vgApi.getDefaultMedia();
    media.currentTime = Math.max(0, media.currentTime - seconds);
  }

  forward(seconds = 10) {
    const media = this.vgApi.getDefaultMedia();
    media.currentTime = Math.min(media.duration, media.currentTime + seconds);
  }

  seekTo(event: MouseEvent) {
    const rect = this.progressBarRef.nativeElement.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const media = this.vgApi.getDefaultMedia();
    media.currentTime = ratio * media.duration;
    this.playedProgress.set(ratio * 100);
  }

  startSeekDrag(event: MouseEvent) {
    this.startDrag(event, this.progressBarRef, ratio => {
      const media = this.vgApi.getDefaultMedia();
      media.currentTime = ratio * media.duration;
      this.playedProgress.set(ratio * 100);
    });
  }

  updateVolume(level: number) {
    const video = this.getVideoElement();
    video.volume = level;
    this.volumeLevel.set(level);
  }

  startVolumeDrag(event: MouseEvent) {
    this.startDrag(event, this.volumeBarRef, ratio => {
      this.updateVolume(ratio);
    });
  }

  toggleFullscreen() {
    const videoEl = document.getElementById('singleVideo');
    if (!document.fullscreenElement) {
      videoEl?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '00:00';
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const sec = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${min}:${sec}`;
  }

  private getVideoElement(): HTMLVideoElement {
    return this.vgApi.getDefaultMedia().elem as HTMLVideoElement;
  }

  private startDrag(
    event: MouseEvent,
    targetRef: ElementRef<HTMLElement>,
    onRatioChange: (ratio: number) => void
  ) {
    const onMouseMove = (e: MouseEvent) => {
      const rect = targetRef.nativeElement.getBoundingClientRect();
      let ratio = (e.clientX - rect.left) / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));
      onRatioChange(ratio);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    onMouseMove(event);
  }
}
