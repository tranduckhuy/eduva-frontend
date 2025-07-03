import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassCardSkeletonComponent } from './class-card-skeleton.component';

describe('ClassCardSkeletonComponent', () => {
  let component: ClassCardSkeletonComponent;
  let fixture: ComponentFixture<ClassCardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassCardSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassCardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
