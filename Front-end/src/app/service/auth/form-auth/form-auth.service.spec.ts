import { TestBed } from '@angular/core/testing';

import { FormAuthService } from './form-auth.service';

describe('FormAuthService', () => {
  let service: FormAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
