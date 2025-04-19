import { TestBed } from '@angular/core/testing';

import { SystemPerformanceService } from './system-performance.service';

describe('SystemPerformanceService', () => {
  let service: SystemPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
