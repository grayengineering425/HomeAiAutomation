import { TestBed } from '@angular/core/testing';

import { FrameDataService } from './frame-data.service';

describe('FrameDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrameDataService = TestBed.get(FrameDataService);
    expect(service).toBeTruthy();
  });
});
