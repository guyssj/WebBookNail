import { TestBed } from '@angular/core/testing';

import { ServicetypeService } from './servicetype.service';

describe('ServicetypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicetypeService = TestBed.get(ServicetypeService);
    expect(service).toBeTruthy();
  });
});
