import { TestBed } from '@angular/core/testing';

import { DataCommunicationService } from './data-communication.service';

describe('DataComService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataCommunicationService = TestBed.get(DataCommunicationService);
    expect(service).toBeTruthy();
  });
});
