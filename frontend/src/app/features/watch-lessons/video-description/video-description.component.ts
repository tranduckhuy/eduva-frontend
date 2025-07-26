import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';

import { ImageModule } from 'primeng/image';

import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';

import {
  type RenderBlock,
  ContentParserService,
} from '../../../shared/services/layout/content-parse/content-parse.service';

import { formatRelativeDate } from '../../../shared/utils/util-functions';

@Component({
  selector: 'video-description',
  standalone: true,
  imports: [ImageModule, SafeHtmlPipe],
  templateUrl: './video-description.component.html',
  styleUrl: './video-description.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoDescriptionComponent implements OnInit {
  private readonly contentParseService = inject(ContentParserService);

  readonly description = input.required<string>();

  contentBlocks = signal<RenderBlock[]>([]);

  ngOnInit(): void {
    this.contentParse(this.description() ?? '');
  }

  formatUpdateDate(input?: string | null): string {
    if (!input) return 'Bài học chưa từng được cập nhật';
    const date = new Date(input);
    if (isNaN(date.getTime())) return 'Định dạng ngày không hợp lệ';
    return `Cập nhật ${formatRelativeDate(input)}`;
  }

  private contentParse(content: string) {
    this.contentBlocks.set(
      this.contentParseService.convertHtmlToBlocks(content)
    );
  }
}
