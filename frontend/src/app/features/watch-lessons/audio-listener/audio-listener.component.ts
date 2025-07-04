import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  input,
  effect,
  afterNextRender,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Plyr from 'plyr';

@Component({
  selector: 'app-audio-listener',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-listener.component.html',
  styleUrls: ['./audio-listener.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioListenerComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  readonly materialSourceUrl = input<string>();
  player!: Plyr;

  audioSrc = computed(() => {
    const url = this.materialSourceUrl();
    return url ? { src: url, type: this.getAudioType(url) } : null;
  });

  constructor() {
    // Handle source changes
    effect(() => {
      const source = this.audioSrc();
      if (source && this.player) {
        this.updatePlayerSource(source);
      }
    });

    // Initialize Plyr after view renders
    afterNextRender(() => {
      this.initializePlayer();
    });
  }

  private initializePlayer() {
    if (!this.audioPlayer?.nativeElement) return;

    this.player = new Plyr(this.audioPlayer.nativeElement, {
      controls: [
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'settings',
        'seek',
      ],
      i18n: {
        play: 'Phát',
        pause: 'Tạm dừng',
        mute: 'Tắt tiếng',
        unmute: 'Bật tiếng',
        volume: 'Âm lượng',
        currentTime: 'Thời gian hiện tại',
        speed: 'Tốc độ',
        normal: 'Bình thường',
      },
    });

    // Handle initial source if it exists
    if (this.audioSrc()) {
      this.updatePlayerSource(this.audioSrc()!);
    }
  }

  private updatePlayerSource(source: { src: string; type: string }) {
    if (!this.player) return;

    // Store current playback state
    const wasPlaying = !this.player.paused;
    const currentTime = this.player.currentTime;

    // Update source
    this.player.source = {
      type: 'audio',
      sources: [
        {
          src: source.src,
          type: source.type,
        },
      ],
    };

    // Restore playback state if needed
    if (wasPlaying) {
      this.player.once('loadedmetadata', () => {
        this.player.currentTime = Math.min(currentTime, this.player.duration);
        this.player.play();
      });
    }
  }

  private getAudioType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp3':
        return 'audio/mpeg';
      case 'wav':
        return 'audio/wav';
      case 'ogg':
        return 'audio/ogg';
      case 'm4a':
        return 'audio/mp4';
      default:
        return 'audio/mpeg'; // default to mp3
    }
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }
}
