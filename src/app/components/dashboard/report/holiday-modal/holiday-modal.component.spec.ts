import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayModalComponent } from './holiday-modal.component';

describe('HolidayModalComponent', () => {
  let component: HolidayModalComponent;
  let fixture: ComponentFixture<HolidayModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
