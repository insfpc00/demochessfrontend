import { TestBed } from '@angular/core/testing';

import { MatchService } from './matchservice.service';

describe('MatchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatchService = TestBed.get(MatchService);
    expect(service).toBeTruthy();
  });
});
