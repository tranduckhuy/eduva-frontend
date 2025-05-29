import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

@Component({
  selector: 'video-player',
  standalone: true,
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent {
  api = inject(VgApiService);
  preload = signal<string>('auto');

  onPlayerReady(source: VgApiService) {
    this.api = source;
    this.api
      .getDefaultMedia()
      .subscriptions.loadedMetadata.subscribe(this.autoplay.bind(this));
  }

  autoplay() {
    // this.api.play();
  }
}
