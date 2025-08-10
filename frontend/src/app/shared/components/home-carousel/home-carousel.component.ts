import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type Item = {
  style: string;
  title: string;
  description: string;
  buttonContent: string;
  imageUrl: string;
  ctaHoverColor: string;
  isRecommend: boolean;
};

@Component({
  selector: 'home-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-carousel.component.html',
  styleUrl: './home-carousel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCarouselComponent implements OnDestroy, AfterViewInit {
  items = signal<Item[]>([
    {
      style: `background: linear-gradient(to right, rgb(44, 140, 188), rgb(88, 200, 199));`,
      title: 'Tham gia lớp học dễ dàng',
      description:
        'Chỉ cần nhập mã lớp do giáo viên cung cấp, bạn sẽ nhanh chóng được kết nối với lớp học của mình. Không cần thao tác phức tạp, mọi thứ được thiết kế để bạn có thể bắt đầu học ngay lập tức.',
      buttonContent: 'Tham gia ngay',
      imageUrl: './images/home-carousel/carousel_1.png',
      ctaHoverColor: 'rgb(44, 140, 188)',
      isRecommend: true,
    },
    {
      style: `background: linear-gradient(to right, rgb(138, 10, 255), rgb(96, 6, 255));`,
      title: 'Tài liệu học tập mọi lúc mọi nơi',
      description:
        'Truy cập và học bài trên mọi thiết bị, bất cứ khi nào bạn muốn. Dù ở nhà, ở trường hay đang di chuyển, bạn vẫn có thể tiếp tục bài học, ôn tập kiến thức và luyện tập kỹ năng mà không bị gián đoạn.',
      buttonContent: 'Bắt đầu học',
      imageUrl: './images/home-carousel/carousel_2.png',
      ctaHoverColor: 'rgb(138, 10, 255)',
      isRecommend: true,
    },
    {
      style: `background: linear-gradient(to right, rgb(104, 40, 250), rgb(255, 186, 164));`,
      title: 'Hỏi đáp ngay trong bài học',
      description:
        'Nếu gặp chỗ chưa hiểu, bạn có thể đặt câu hỏi ngay trong bài học và nhận được lời giải thích chi tiết từ giáo viên cũng như góp ý từ các bạn học khác. Tương tác nhanh chóng, học tập hiệu quả hơn.',
      buttonContent: 'Đặt câu hỏi',
      imageUrl: './images/home-carousel/carousel_3.png',
      ctaHoverColor: 'rgb(104, 40, 250)',
      isRecommend: true,
    },
    {
      style: `background: linear-gradient(to right, rgb(40, 119, 250), rgb(103, 23, 205));`,
      title: 'Kết nối với giáo viên và bạn học',
      description:
        'Học tập, trao đổi và chia sẻ kinh nghiệm trực tiếp trên Eduva. Tăng cường kết nối với giáo viên và bạn học để cùng nhau tiến bộ mỗi ngày.',
      buttonContent: 'Kết nối ngay',
      imageUrl: './images/home-carousel/carousel_4.png',
      ctaHoverColor: 'rgb(40, 119, 250)',
      isRecommend: false,
    },
    {
      style: `background: linear-gradient(to right, rgb(118, 18, 255), rgb(5, 178, 255));`,
      title: 'Không bỏ lỡ thông báo',
      description:
        'Nhận thông báo tức thì khi có bài học mới, câu trả lời từ giáo viên hay tài liệu bổ sung. Luôn cập nhật để không bỏ lỡ bất kỳ thông tin quan trọng nào.',
      buttonContent: 'Xem thông báo',
      imageUrl: './images/home-carousel/carousel_5.png',
      ctaHoverColor: 'rgb(118, 18, 255)',
      isRecommend: false,
    },
    {
      style: `background: linear-gradient(to right, rgb(254, 33, 94), rgb(255, 148, 2));`,
      title: 'Học tập hiệu quả hơn',
      description:
        'Giao diện đơn giản, dễ sử dụng, giúp bạn tập trung hơn và đạt được mục tiêu học tập nhanh chóng. Tối ưu trải nghiệm để bạn học ít mà hiệu quả nhiều.',
      buttonContent: 'Trải nghiệm ngay',
      imageUrl: './images/home-carousel/carousel_6.png',
      ctaHoverColor: 'rgb(254, 33, 94)',
      isRecommend: false,
    },
  ]);

  @ViewChild('carouselWrapper', { static: true })
  private readonly carouselWrapper!: ElementRef<HTMLDivElement>;

  private autoSlideInterval?: ReturnType<typeof setInterval>;
  private readonly controller = new AbortController();

  private readonly itemCount = computed(() => this.items().length);

  readonly transformStyle = computed(
    () => `translateX(calc(-${this.currentIndex()}00%))`
  );

  currentIndex = signal<number>(0);

  private startX = 0;
  private endX = 0;

  ngAfterViewInit(): void {
    const el = this.carouselWrapper.nativeElement;
    el.addEventListener('touchstart', this.onTouchStart, {
      passive: true,
      signal: this.controller.signal,
    });
    el.addEventListener('touchend', this.onTouchEnd, {
      passive: true,
      signal: this.controller.signal,
    });
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.controller.abort(); // Clean up listeners
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
  }

  readonly goToSlide = (index: number) => {
    this.currentIndex.set(index);
    this.resetAutoSlide();
  };

  readonly nextSlide = () => {
    const next = this.currentIndex() + 1;
    this.currentIndex.set(next >= this.itemCount() ? 0 : next);
    this.resetAutoSlide();
  };

  readonly prevSlide = () => {
    const prev = this.currentIndex() - 1;
    this.currentIndex.set(prev < 0 ? this.itemCount() - 1 : prev);
    this.resetAutoSlide();
  };

  private readonly onTouchStart = (e: TouchEvent) => {
    this.startX = e.touches[0].clientX;
  };

  private readonly onTouchEnd = (e: TouchEvent) => {
    this.endX = e.changedTouches[0].clientX;
    const delta = this.endX - this.startX;

    if (delta > 50) this.prevSlide();
    else if (delta < -50) this.nextSlide();
  };

  private readonly startAutoSlide = () => {
    this.autoSlideInterval = setInterval(this.nextSlide, 3000);
  };

  private readonly resetAutoSlide = () => {
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  };
}
