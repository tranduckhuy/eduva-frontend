import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ClassicEditor,
  EditorConfig,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  Base64UploadAdapter,
  CloudServices,
  Essentials,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  Link,
  Paragraph,
  Code,
  Mention,
} from 'ckeditor5';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import type { Writer } from '@ckeditor/ckeditor5-engine';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [FormsModule, CommonModule, CKEditorModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextEditorComponent {
  editorValue = input.required<string>();
  invalid = input<boolean>();

  valueChange = output<string>();

  placeholder = input<string>('Nhập nội dung...');
  isAutoFocus = input<boolean>(false);
  isHeightTextBox = input<boolean>(false);

  editorInstance: any;
  editor = ClassicEditor;
  config!: EditorConfig;

  ngOnInit(): void {
    this.config = {
      licenseKey: 'GPL',
      placeholder: this.placeholder(),
      toolbar: [
        'bold',
        'italic',
        'underline',
        'blockQuote',
        'code',
        'uploadImage',
        'link',
      ],
      plugins: [
        Autoformat,
        BlockQuote,
        Bold,
        CloudServices,
        Essentials,
        Image,
        ImageCaption,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Base64UploadAdapter,
        Italic,
        Link,
        Paragraph,
        PictureEditing,
        Underline,
        Code,
        Mention,
      ],
      image: {
        resizeOptions: [
          {
            name: 'resizeImage:original',
            label: 'Default image width',
            value: null,
          },
          { name: 'resizeImage:50', label: '50% page width', value: '50' },
          { name: 'resizeImage:75', label: '75% page width', value: '75' },
        ],
        toolbar: [
          'imageTextAlternative',
          'toggleImageCaption',
          '|',
          'imageStyle:inline',
          'imageStyle:wrapText',
          'imageStyle:breakText',
          '|',
          'resizeImage',
        ],
      },
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
      },
    };
  }

  onEditorReady(editor: any) {
    this.editorInstance = editor;

    editor.model.document.on('change:data', () => {
      const rawHtml = editor.getData();
      const cleaned = this.convertImgToPImage(rawHtml);
      this.valueChange.emit(cleaned);
    });

    if (this.isAutoFocus()) {
      setTimeout(() => {
        editor.editing.view.focus();
        editor.model.change((writer: Writer) => {
          const root = editor.model.document.getRoot();
          if (root) {
            const end = editor.model.createPositionAt(root, 'end');
            writer.setSelection(end);
          }
        });
      });
    }
  }

  convertImgToPImage(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('figure.image').forEach(figure => {
      const img = figure.querySelector('img');
      if (!img) return;

      const pImage = document.createElement('p-image');
      pImage.setAttribute('src', img.getAttribute('src') ?? '');
      pImage.setAttribute('alt', img.getAttribute('alt') ?? '');
      pImage.setAttribute('preview', 'true');

      figure.replaceWith(pImage);
    });

    return doc.body.innerHTML;
  }
}
