import { TestBed } from '@angular/core/testing';

import { JaqpotService } from './jaqpot.service';

describe('JaqpotService', () => {
  let service: JaqpotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JaqpotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
