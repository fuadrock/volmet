import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlAddComponent } from './access-control-add.component';

describe('AccessControlAddComponent', () => {
  let component: AccessControlAddComponent;
  let fixture: ComponentFixture<AccessControlAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessControlAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
