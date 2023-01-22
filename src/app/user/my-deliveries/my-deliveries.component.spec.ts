import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDeliveriesComponent } from './my-deliveries.component';

describe('MyDeliveriesComponent', () => {
  let component: MyDeliveriesComponent;
  let fixture: ComponentFixture<MyDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyDeliveriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
