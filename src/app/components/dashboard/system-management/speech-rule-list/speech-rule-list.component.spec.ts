import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechRuleListComponent } from './speech-rule-list.component';

describe('SpeechRuleListComponent', () => {
  let component: SpeechRuleListComponent;
  let fixture: ComponentFixture<SpeechRuleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeechRuleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechRuleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
