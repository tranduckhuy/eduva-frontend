import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentContextComponent } from './comment-context.component';

describe('CommentContextComponent', () => {
  let component: CommentContextComponent;
  let fixture: ComponentFixture<CommentContextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentContextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
