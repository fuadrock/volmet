import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLogModalComponent } from './event-log-modal.component';

describe('EventLogModalComponent', () => {
  let component: EventLogModalComponent;
  let fixture: ComponentFixture<EventLogModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLogModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
