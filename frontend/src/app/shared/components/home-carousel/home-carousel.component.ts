import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  OnDestroy,
  OnInit,
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
      title: 'Lớp Offline tại Hà Nội',
      description:
        'Hình thức học Offline phù hợp nếu bạn muốn được hướng dẫn và hỗ trợ trực tiếp tại lớp. Giờ học linh hoạt, phù hợp cả sinh viên và người đi làm.',
      buttonContent: 'Tư vấn miễn phí',
      imageUrl:
        'https://files.fullstack.edu.vn/f8-prod/banners/36/67ef3dad5d92b.png',
      ctaHoverColor: 'rgb(44, 140, 188)',
      isRecommend: true,
    },
    {
      style: `background: linear-gradient(to right, rgb(138, 10, 255), rgb(96, 6, 255));`,
      title: 'Mở bán khóa JavaScript Pro',
      description:
        'Từ 08/08/2024 khóa học sẽ có giá 1.399k. Khi khóa học hoàn thiện sẽ trở về giá gốc.',
      buttonContent: 'Học thử miễn phí',
      imageUrl:
        'https://files.fullstack.edu.vn/f8-prod/banners/37/66b5a6b16d31a.png',
      ctaHoverColor: 'rgb(138, 10, 255)',
      isRecommend: true,
    },
    {
      style: `background: linear-gradient(to right, rgb(104, 40, 250), rgb(255, 186, 164));`,
      title: 'Học HTML CSS cho người mới',
      description:
        'Thực hành dự án với Figma, hàng trăm bài tập, hướng dẫn 100% bởi Sơn Đặng, tặng kèm Flashcards, v.v.',
      buttonContent: 'Học thử miễn phí',
      imageUrl:
        'https://files.fullstack.edu.vn/f8-prod/banners/20/68010e5598e64.png',
      ctaHoverColor: 'rgb(104, 40, 250)',
      isRecommend: true,
    },
    {
      style: `background: linear-gradient(to right, rgb(40, 119, 250), rgb(103, 23, 205));`,
      title: 'Học ReactJS Miễn Phí!',
      description:
        'Khóa học ReactJS từ cơ bản tới nâng cao. Kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với ReactJS.',
      buttonContent: 'Đăng ký ngay',
      imageUrl:
        'https://files.fullstack.edu.vn/f8-prod/banners/Banner_web_ReactJS.png',
      ctaHoverColor: 'rgb(40, 119, 250)',
      isRecommend: false,
    },
    {
      style: `background: linear-gradient(to right, rgb(118, 18, 255), rgb(5, 178, 255));`,
      title: 'Thành Quả của Học Viên',
      description:
        'Để đạt được kết quả tốt trong mọi việc ta cần xác định mục tiêu rõ ràng cho việc đó. Học lập trình cũng không là ngoại lệ.',
      buttonContent: 'Xem thành quả',
      imageUrl:
        'https://files.fullstack.edu.vn/f8-prod/banners/Banner_01_2.png',
      ctaHoverColor: 'rgb(118, 18, 255)',
      isRecommend: false,
    },
    {
      style: `background: linear-gradient(to right, rgb(254, 33, 94), rgb(255, 148, 2));`,
      title: 'F8 trên Youtube',
      description:
        'F8 được nhắc tới ở mọi nơi, ở đâu có cơ hội việc làm cho nghề IT và có những con người yêu thích lập trình F8 sẽ ở đó.',
      buttonContent: 'Đăng ký kênh',
      imageUrl:
        'https://files.fullstack.edu.vn/f8-prod/banners/Banner_03_youtube.png',
      ctaHoverColor: 'rgb(254, 33, 94)',
      isRecommend: false,
    },
    {
      style: `background: linear-gradient(to right, rgb(0, 126, 254), rgb(6, 195, 254));`,
      title: 'F8 trên Facebook',
      description:
        'F8 được nhắc tới ở mọi nơi, ở đâu có cơ hội việc làm cho nghề IT và có những con người yêu thích lập trình F8 sẽ ở đó.',
      buttonContent: 'Tham gia nhóm',
      imageUrl:
        'https://files.fullstack.edu.vn/f8-prod/banners/Banner_04_2.png',
      ctaHoverColor: 'rgb(0, 126, 254)',
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
