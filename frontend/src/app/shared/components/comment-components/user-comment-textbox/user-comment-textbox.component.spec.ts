import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCommentTextboxComponent } from './user-comment-textbox.component';

describe('UserCommentTextboxComponent', () => {
  let component: UserCommentTextboxComponent;
  let fixture: ComponentFixture<UserCommentTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCommentTextboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCommentTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
