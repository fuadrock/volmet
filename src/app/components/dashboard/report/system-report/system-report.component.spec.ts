import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemReportComponent } from './system-report.component';

describe('SystemReportComponent', () => {
  let component: SystemReportComponent;
  let fixture: ComponentFixture<SystemReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
