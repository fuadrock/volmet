import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullScreenDecodedTextComponent } from './full-screen-decoded-text.component';

describe('FullScreenDecodedTextComponent', () => {
  let component: FullScreenDecodedTextComponent;
  let fixture: ComponentFixture<FullScreenDecodedTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullScreenDecodedTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullScreenDecodedTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
