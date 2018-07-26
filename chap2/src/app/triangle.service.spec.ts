import { TestBed, inject } from '@angular/core/testing';

import { TriangleService } from './triangle.service';

describe('TriangleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TriangleService]
    });
  });

  it('should be created', inject([TriangleService], (service: TriangleService) => {
    expect(service).toBeTruthy();
  }));
});
