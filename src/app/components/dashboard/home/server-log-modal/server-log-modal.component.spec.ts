import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerLogModalComponent } from './server-log-modal.component';

describe('ServerLogModalComponent', () => {
  let component: ServerLogModalComponent;
  let fixture: ComponentFixture<ServerLogModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerLogModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
