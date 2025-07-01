import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import {
  ImageCropperComponent,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';

import { Slider } from 'primeng/slider';

@Component({
  selector: 'app-update-avatar-form',
  standalone: true,
  imports: [ImageCropperComponent, Slider, FormsModule],
  templateUrl: './update-avatar-form.component.html',
  styleUrl: './update-avatar-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAvatarFormComponent {
  private readonly sanitizer = inject(DomSanitizer);

  avatarUrl = input.required<string>();
  fullName = input.required<string>();

  previewAvatar = signal<string | ArrayBuffer | null>(null);
  imageChangedEvent = signal<Event | null>(null);
  croppedImage = signal<SafeUrl>('');
  transform = signal<ImageTransform>({
    translateUnit: 'px',
    scale: 1,
    rotate: 0,
    flipH: false,
    flipV: false,
    translateH: 0,
    translateV: 0,
  });

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent.set(event);
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      this.croppedImage.set(
        this.sanitizer.bypassSecurityTrustUrl(event.objectUrl)
      );
    } else {
      this.croppedImage.set('');
    }
    // event.blob can be used to upload the cropped image
  }

  // imageLoaded(image: LoadedImage) {}

  // cropperReady() {
  // cropper ready
  // }

  // loadImageFailed() {
  // show message
  // }

  zoomOut() {
    if (this.transform().scale! <= 1) return;
    this.transform.set({
      ...this.transform,
      scale: this.transform().scale! - 0.1,
    });
  }

  zoomIn() {
    if (this.transform().scale! >= 10) return;
    this.transform.set({
      ...this.transform,
      scale: this.transform().scale! + 0.1,
    });
  }

  scaleChange(scale: number) {
    this.transform.set({
      ...this.transform,
      scale,
    });
  }

  transformChange(transform: ImageTransform) {
    console.log(transform);
  }

  onFileSelected(event: Event) {
    this.imageChangedEvent.set(event);
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Optionally validate it's an image
      if (!file.type.startsWith('image/')) {
        console.error('Selected file is not an image.');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.previewAvatar.set(reader.result); // This is the base64 image string
      };

      reader.readAsDataURL(file);
    }
  }

  reset() {
    this.previewAvatar.set('');
    this.croppedImage.set('');
    this.transform.set({
      translateUnit: 'px',
      scale: 1,
      rotate: 0,
      flipH: false,
      flipV: false,
      translateH: 0,
      translateV: 0,
    });
    this.imageChangedEvent.set(null);
  }
}
