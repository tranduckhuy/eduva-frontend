import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'auth-modal-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-modal-header.component.html',
  styleUrl: './auth-modal-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModalHeaderComponent {
  screenState = input.required<
    'login' | 'forgot-password' | 'reset-password' | 'otp-verification'
  >();

  readonly subHeading = computed(() => {
    switch (this.screenState()) {
      case 'forgot-password':
        return 'Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã khôi phục mật khẩu gồm 6 chữ số đến hộp thư của bạn.';
      case 'reset-password':
        return 'Đặt mật khẩu mới cho tài khoản của bạn để có thể tiếp tục truy cập các khóa học.';
      case 'otp-verification':
        return 'Tài khoản của bạn đã được bảo vệ bởi mã xác minh 2 bước. Vui lòng nhập mã gồm 6 chữ số được gửi tới hợp thư của bạn.';
      default:
        return 'Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng chung sẽ bị khóa.';
    }
  });
}
