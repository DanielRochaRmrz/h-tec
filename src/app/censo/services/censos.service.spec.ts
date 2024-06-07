import { TestBed } from '@angular/core/testing';

import { CensosService } from './censos.service';

describe('CensosService', () => {
  let service: CensosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CensosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
