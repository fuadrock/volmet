import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceRuleEditComponent } from './source-rule-edit.component';

describe('SourceRuleEditComponent', () => {
  let component: SourceRuleEditComponent;
  let fixture: ComponentFixture<SourceRuleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceRuleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceRuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
