import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOrderDetailsComponent } from './modal-order-details.component';

describe('ModalOrderDetailsComponent', () => {
  let component: ModalOrderDetailsComponent;
  let fixture: ComponentFixture<ModalOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
