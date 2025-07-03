import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassDetailFolderSkeletonComponent } from './class-detail-folder-skeleton.component';

describe('ClassDetailFolderSkeletonComponent', () => {
  let component: ClassDetailFolderSkeletonComponent;
  let fixture: ComponentFixture<ClassDetailFolderSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassDetailFolderSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassDetailFolderSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
