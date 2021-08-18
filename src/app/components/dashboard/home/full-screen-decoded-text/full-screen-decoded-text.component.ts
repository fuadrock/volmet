import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-full-screen-decoded-text',
  templateUrl: './full-screen-decoded-text.component.html',
  styleUrls: ['./full-screen-decoded-text.component.scss']
})
export class FullScreenDecodedTextComponent implements OnInit {
  @Input() data: string;
  decodedForm: FormGroup;
  constructor(protected ref: NbDialogRef<FullScreenDecodedTextComponent>,private fb: FormBuilder,) {
    this.decodedForm = this.fb.group({
      Data: [],
    });
   }

  ngOnInit(): void {
    this.decodedForm.patchValue({
      Data: this.data
    })
  }

  dismiss(){
    this.ref.close();
  }
}
