import { TestBed } from '@angular/core/testing';

import { LocalresService } from './localres.service';

describe('LocalresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalresService = TestBed.get(LocalresService);
    expect(service).toBeTruthy();
  });
});
