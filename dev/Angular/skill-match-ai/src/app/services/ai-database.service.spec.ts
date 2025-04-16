import { TestBed } from '@angular/core/testing';

import { AiDatabaseService } from './ai-database.service';

describe('AiDatabaseService', () => {
  let service: AiDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
