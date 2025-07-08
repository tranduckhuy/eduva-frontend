import { TestBed } from '@angular/core/testing';
import { ClassService } from './class.service';
import { RequestService } from '../../core/request/request.service';
import { ToastHandlingService } from '../../core/toast/toast-handling.service';
import { StatusCode } from '../../../constants/status-code.constant';
import { of, throwError } from 'rxjs';

describe('ClassService', () => {
    let service: ClassService;
    let requestService: any;
    let toastService: any;

    const mockClass = {
        id: '1',
        schoolId: 1,
        className: 'Test Class',
        name: 'Test Class',
        classCode: 'C1',
        classId: 'C1',
        studentId: 'S1',
        teacherName: 'Teacher',
        studentName: 'Student',
        schoolName: 'Test School',
        backgroundImageUrl: '',
        teacherAvatarUrl: '',
        studentAvatarUrl: '',
        enrolledAt: '2024-01-01',
        classStatus: 0,
        countLessonMaterial: 10,
    };
    const mockClasses = [
        mockClass,
        {
            ...mockClass,
            id: '2',
            className: 'Class 2',
            name: 'Class 2',
            classCode: 'C2',
            classId: 'C2',
        },
    ];
    const mockListResponse = {
        statusCode: StatusCode.SUCCESS,
        data: { data: mockClasses, count: 2 },
    };
    const mockEntityList = { data: mockClasses, count: 2 };

    beforeEach(() => {
        requestService = {
            get: jasmine.createSpy(),
            post: jasmine.createSpy(),
        };
        toastService = {
            errorGeneral: jasmine.createSpy(),
            success: jasmine.createSpy(),
            error: jasmine.createSpy(),
            warn: jasmine.createSpy(),
        };
        TestBed.configureTestingModule({
            providers: [
                ClassService,
                { provide: RequestService, useValue: requestService },
                { provide: ToastHandlingService, useValue: toastService },
            ],
        });
        service = TestBed.inject(ClassService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get student classes enrolled and update signals on success', (done) => {
        requestService.get.and.returnValue(of(mockListResponse));
        service.getStudentClassesEnrolled({} as any).subscribe((result) => {
            expect(result).toEqual(mockEntityList);
            expect(service.classes()).toEqual(mockClasses);
            expect(service.totalClass()).toBe(2);
            expect(toastService.errorGeneral).not.toHaveBeenCalled();
            done();
        });
    });

    it('should handle error in getStudentClassesEnrolled', (done) => {
        requestService.get.and.returnValue(throwError(() => new Error('fail')));
        service.getStudentClassesEnrolled({} as any).subscribe((result) => {
            expect(result).toBeUndefined(); // EMPTY observable emits nothing
            expect(toastService.errorGeneral).not.toHaveBeenCalled();
            done();
        });
    });

    it('should get student class by id and update signal on success', (done) => {
        const mockResponse = {
            statusCode: StatusCode.SUCCESS,
            data: mockClass,
        };
        requestService.get.and.returnValue(of(mockResponse));
        service.getStudentClassById('1').subscribe((result) => {
            expect(result).toEqual(mockClass);
            expect(service.classModel()).toEqual(mockClass);
            expect(toastService.errorGeneral).not.toHaveBeenCalled();
            done();
        });
    });

    it('should handle error in getStudentClassById', (done) => {
        requestService.get.and.returnValue(throwError(() => new Error('fail')));
        service.getStudentClassById('1').subscribe((result) => {
            expect(result).toBeNull();
            expect(toastService.errorGeneral).toHaveBeenCalled();
            done();
        });
    });

    it('should clear classes and totalClass signals', () => {
        service['classesSignal'].set(mockClasses);
        service['totalClassSignal'].set(5);
        service.clearClasses();
        expect(service.classes()).toEqual([]);
        expect(service.totalClass()).toBe(0);
    });

    it('should enroll class and show success toast on success', (done) => {
        const mockResponse = {
            statusCode: StatusCode.SUCCESS,
            data: mockClass,
        };
        requestService.post.and.returnValue(of(mockResponse));
        service.enrollClass('C1').subscribe((result) => {
            expect(result).toEqual(mockClass);
            expect(toastService.success).toHaveBeenCalledWith(
                'Thành công',
                'Bạn đã tham gia vào lớp học thành công'
            );
            expect(toastService.errorGeneral).not.toHaveBeenCalled();
            done();
        });
    });

    it('should enroll class and show general error toast on non-success response', (done) => {
        const mockResponse = { statusCode: 999, data: null };
        requestService.post.and.returnValue(of(mockResponse));
        service.enrollClass('C1').subscribe((result) => {
            expect(result).toBeNull();
            expect(toastService.success).not.toHaveBeenCalled();
            expect(toastService.errorGeneral).toHaveBeenCalled();
            done();
        });
    });

    it('should handle CLASS_NOT_FOUND error in enrollClass', (done) => {
        const error = { error: { statusCode: StatusCode.CLASS_NOT_FOUND } };
        requestService.post.and.returnValue(throwError(() => error));
        service.enrollClass('C1').subscribe((result) => {
            expect(result).toBeNull();
            expect(toastService.error).toHaveBeenCalledWith(
                'Tham gia lớp học thất bại',
                'Mã lớp không tồn tại!'
            );
            done();
        });
    });

    it('should handle CLASS_CODE_DUPLICATE error in enrollClass', (done) => {
        const error = {
            error: { statusCode: StatusCode.CLASS_CODE_DUPLICATE },
        };
        requestService.post.and.returnValue(throwError(() => error));
        service.enrollClass('C1').subscribe((result) => {
            expect(result).toBeNull();
            expect(toastService.error).toHaveBeenCalledWith(
                'Tham gia lớp học thất bại',
                'Mã lớp đã tồn tại!'
            );
            done();
        });
    });

    it('should handle STUDENT_CANNOT_ENROLL_DIFFERENT_SCHOOL error in enrollClass', (done) => {
        const error = {
            error: {
                statusCode: StatusCode.STUDENT_CANNOT_ENROLL_DIFFERENT_SCHOOL,
            },
        };
        requestService.post.and.returnValue(throwError(() => error));
        service.enrollClass('C1').subscribe((result) => {
            expect(result).toBeNull();
            expect(toastService.error).toHaveBeenCalledWith(
                'Tham gia lớp học thất bại',
                'Bạn không thể tham gia một lớp học ngoài phạm vi trường của bạn!'
            );
            done();
        });
    });

    it('should handle STUDENT_ALREADY_ENROLLED warning in enrollClass', (done) => {
        const error = {
            error: { statusCode: StatusCode.STUDENT_ALREADY_ENROLLED },
        };
        requestService.post.and.returnValue(throwError(() => error));
        service.enrollClass('C1').subscribe((result) => {
            expect(result).toBeNull();
            expect(toastService.warn).toHaveBeenCalledWith(
                'Chú ý',
                'Bạn đã tham gia lớp học'
            );
            done();
        });
    });

    it('should handle CLASS_NOT_ACTIVE error in enrollClass', (done) => {
        const error = { error: { statusCode: StatusCode.CLASS_NOT_ACTIVE } };
        requestService.post.and.returnValue(throwError(() => error));
        service.enrollClass('C1').subscribe((result) => {
            expect(result).toBeNull();
            expect(toastService.error).toHaveBeenCalledWith(
                'Tham gia lớp học thất bại',
                'Lớp học hiện chưa được kích hoạt'
            );
            done();
        });
    });

    it('should handle unknown error in enrollClass', (done) => {
        const error = { error: { statusCode: 9999 } };
        requestService.post.and.returnValue(throwError(() => error));
        service.enrollClass('C1').subscribe((result) => {
            expect(result).toBeNull();
            expect(toastService.errorGeneral).toHaveBeenCalled();
            done();
        });
    });
});
