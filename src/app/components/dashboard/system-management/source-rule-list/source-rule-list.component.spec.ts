import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceRuleListComponent } from './source-rule-list.component';

describe('SourceRuleListComponent', () => {
  let component: SourceRuleListComponent;
  let fixture: ComponentFixture<SourceRuleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceRuleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceRuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
