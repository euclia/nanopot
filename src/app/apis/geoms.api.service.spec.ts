import { TestBed } from '@angular/core/testing';

import { Geoms.ApiService } from './geoms.api.service';

describe('Geoms.ApiService', () => {
  let service: Geoms.ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Geoms.ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
