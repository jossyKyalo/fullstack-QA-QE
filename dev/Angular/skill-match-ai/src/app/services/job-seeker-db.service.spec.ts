import { TestBed } from '@angular/core/testing';

import { JobSeekerDbService } from './job-seeker-db.service';

describe('JobSeekerDbService', () => {
  let service: JobSeekerDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobSeekerDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
