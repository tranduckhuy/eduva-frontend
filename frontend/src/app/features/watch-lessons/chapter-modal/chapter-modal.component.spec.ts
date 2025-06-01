import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterModalComponent } from './chapter-modal.component';

describe('ChapterModalComponent', () => {
  let component: ChapterModalComponent;
  let fixture: ComponentFixture<ChapterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
