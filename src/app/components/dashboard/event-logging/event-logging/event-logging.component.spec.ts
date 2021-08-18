import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLoggingComponent } from './event-logging.component';

describe('EventLoggingComponent', () => {
  let component: EventLoggingComponent;
  let fixture: ComponentFixture<EventLoggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLoggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLoggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
