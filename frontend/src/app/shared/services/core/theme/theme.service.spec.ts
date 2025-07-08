import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { DOCUMENT } from '@angular/common';
import { RendererFactory2, PLATFORM_ID } from '@angular/core';
import { vi } from 'vitest';

// Provide a global mock for window.matchMedia
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('ThemeService', () => {
  let mockDocument: Document;
  let mockRenderer: any;
  let rendererFactory: RendererFactory2;
  let platformId: any;

  beforeEach(() => {
    // Mock document
    mockDocument = document.implementation.createHTMLDocument('Test');
    Object.defineProperty(mockDocument, 'documentElement', {
      value: mockDocument.createElement('html'),
      configurable: true,
    });
    // Mock Renderer
    mockRenderer = {
      addClass: vi.fn(),
      removeClass: vi.fn(),
    };
    rendererFactory = {
      createRenderer: () => mockRenderer,
    } as any;
    // Mock platform
    platformId = 'browser';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    const matchMediaSpy = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query: string) => {
        return { matches: false } as any;
      });
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: RendererFactory2, useValue: rendererFactory },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    const service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
    matchMediaSpy.mockRestore();
  });

  it('should initialize with theme from localStorage if present', () => {
    const localStorageMock: { [key: string]: string } = { theme: 'dark' };
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
    });
    const matchMediaSpy = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query: string) => {
        return { matches: false } as any;
      });
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: RendererFactory2, useValue: rendererFactory },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
    matchMediaSpy.mockRestore();
  });

  it('should initialize with system preference if localStorage is not set', () => {
    const localStorageMock: { [key: string]: string } = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
    });
    const matchMediaSpy = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query: string) => {
        return { matches: true } as any;
      });
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: RendererFactory2, useValue: rendererFactory },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('dark');
    matchMediaSpy.mockRestore();
  });

  it('should default to light if no localStorage and system does not prefer dark', () => {
    const localStorageMock: { [key: string]: string } = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
    });
    const matchMediaSpy = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query: string) => {
        return { matches: false } as any;
      });
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: RendererFactory2, useValue: rendererFactory },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    const service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
    matchMediaSpy.mockRestore();
  });

  it('should set theme and persist to localStorage', () => {
    const localStorageMock: { [key: string]: string } = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
    });
    const matchMediaSpy = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query: string) => {
        return { matches: false } as any;
      });
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: RendererFactory2, useValue: rendererFactory },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');
    expect(localStorageMock['theme']).toBe('dark');
    expect(service.theme()).toBe('dark');
    matchMediaSpy.mockRestore();
  });

  it('should add dark class to documentElement when theme is dark', async () => {
    const localStorageMock: { [key: string]: string } = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
    });
    const matchMediaSpy = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query: string) => {
        return { matches: false } as any;
      });
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: RendererFactory2, useValue: rendererFactory },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark');
    await Promise.resolve(); // flush microtasks for effect
    expect(mockRenderer.addClass).toHaveBeenCalledWith(
      mockDocument.documentElement,
      'dark'
    );
    matchMediaSpy.mockRestore();
  });

  it('should remove dark class from documentElement when theme is light', async () => {
    const localStorageMock: { [key: string]: string } = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
    });
    const matchMediaSpy = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query: string) => {
        return { matches: false } as any;
      });
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: RendererFactory2, useValue: rendererFactory },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });
    const service = TestBed.inject(ThemeService);
    service.setTheme('dark'); // trigger addClass first
    await Promise.resolve(); // flush microtasks for effect
    service.setTheme('light'); // now removeClass should be called
    await Promise.resolve(); // flush microtasks for effect
    expect(mockRenderer.removeClass).toHaveBeenCalledWith(
      mockDocument.documentElement,
      'dark'
    );
    matchMediaSpy.mockRestore();
  });
});
