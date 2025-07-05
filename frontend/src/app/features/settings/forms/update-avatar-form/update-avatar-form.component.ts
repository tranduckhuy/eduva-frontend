import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ImageCropperComponent,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';

import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';

import { UploadFileService } from '../../../../shared/services/api/file/upload-file.service';
import { ToastHandlingService } from '../../../../shared/services/core/toast/toast-handling.service';

import { MAX_IMPORT_FILE_SIZE } from '../../../../shared/constants/common.constant';

@Component({
  selector: 'app-update-avatar-form',
  standalone: true,
  imports: [FormsModule, ImageCropperComponent, SliderModule, ButtonModule],
  templateUrl: './update-avatar-form.component.html',
  styleUrl: './update-avatar-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAvatarFormComponent {
  private readonly avatarInputRef = viewChild<ElementRef>('avatarInput');

  private readonly uploadFileService = inject(UploadFileService);
  private readonly toastHandlingService = inject(ToastHandlingService);

  avatarUrl = input.required<string>();
  fullName = input.required<string>();

  avatarChanged = output<string>();

  isLoading = signal<boolean>(false);
  isPreviewAvatar = signal<boolean>(false);
  imageChangedEvent = signal<Event | null>(null);
  croppedBlob = signal<Blob | null>(null);
  transform = signal<ImageTransform>({
    translateUnit: 'px',
    scale: 1,
    rotate: 0,
    flipH: false,
    flipV: false,
    translateH: 0,
    translateV: 0,
  });

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      this.croppedBlob.set(event.blob);
    }
  }

  async saveAvatar() {
    this.isLoading.set(true);

    const blob = this.croppedBlob();
    if (!blob) {
      this.isLoading.set(false);
      return;
    }

    const timestamp = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const blobName = `avatar_${timestamp}`;

    try {
      const uploadedUrl = await this.uploadFileService.uploadFile(
        blob,
        blobName,
        'avatar'
      );

      if (!uploadedUrl) return;

      this.isLoading.set(false);
      this.avatarChanged.emit(uploadedUrl);
    } catch {
      this.isLoading.set(false);
      this.toastHandlingService.errorGeneral();
    }
  }

  onFileSelected(event: Event) {
    this.imageChangedEvent.set(event);
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.toastHandlingService.warn(
          'Tệp không hợp lệ',
          'Chỉ chấp nhận tệp hình ảnh PNG hoặc JPEG.'
        );
        return;
      }

      if (file.size > MAX_IMPORT_FILE_SIZE) {
        this.toastHandlingService.warn(
          'Dung lượng vượt quá giới hạn',
          `Kích thước tệp không được vượt quá ${MAX_IMPORT_FILE_SIZE}MB.`
        );
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        this.isPreviewAvatar.set(true);
      };

      reader.readAsDataURL(file);
    }
  }

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

  reset() {
    this.isPreviewAvatar.set(false);
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

    const input = this.avatarInputRef()?.nativeElement as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
}
