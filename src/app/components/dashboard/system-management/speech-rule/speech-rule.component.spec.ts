import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechRuleComponent } from './speech-rule.component';

describe('SpeechRuleComponent', () => {
  let component: SpeechRuleComponent;
  let fixture: ComponentFixture<SpeechRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeechRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
