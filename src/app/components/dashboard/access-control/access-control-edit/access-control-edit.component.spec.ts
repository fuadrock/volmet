import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessControlEditComponent } from './access-control-edit.component';

describe('AccessControlEditComponent', () => {
  let component: AccessControlEditComponent;
  let fixture: ComponentFixture<AccessControlEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessControlEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessControlEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
