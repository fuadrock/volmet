import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-holiday-modal',
  templateUrl: './holiday-modal.component.html',
  styleUrls: ['./holiday-modal.component.scss']
})
export class HolidayModalComponent implements OnInit {

  @Input() event: any;

  constructor(protected ref: NbDialogRef<HolidayModalComponent>) { }

  ngOnInit(): void {
  }

  dismiss() {
    this.ref.close();
  }
  delete(value){
    this.ref.close(value);
  }

  save(value){
    this.ref.close(value);
  }

}
