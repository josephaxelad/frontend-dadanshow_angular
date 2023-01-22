import { TestBed } from '@angular/core/testing';

import { DeliveriesZoneService } from './deliveries-zone.service';

describe('DeliveriesZoneService', () => {
  let service: DeliveriesZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliveriesZoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
