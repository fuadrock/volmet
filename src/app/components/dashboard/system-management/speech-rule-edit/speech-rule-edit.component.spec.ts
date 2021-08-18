import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechRuleEditComponent } from './speech-rule-edit.component';

describe('SpeechRuleEditComponent', () => {
  let component: SpeechRuleEditComponent;
  let fixture: ComponentFixture<SpeechRuleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeechRuleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechRuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
