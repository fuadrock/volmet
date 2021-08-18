import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';

@Component({
  selector: 'ngx-event-logging',
  templateUrl: './event-logging.component.html',
  styleUrls: ['./event-logging.component.scss']
})
export class EventLoggingComponent implements OnInit {

  saveBtn: MatProgressButtonOptions = {
    active: false,
    text: 'Save',
    spinnerSize: 19,
    raised: true,
    stroked: false,
    buttonColor: 'accent',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
  };
  AddFrom: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toaster: NbToastrService
  ) {


    this.AddFrom = this.fb.group({
      LogSettings: this.fb.array([])
    }
    );
  }

  ngOnInit() {
    this.getNecessaryData();
  }

  getLogs() {
    return (<FormArray>this.AddFrom.get("LogSettings")).controls;
  }


  getName(i) {
    return this.getLogs()[i].value["TypeName"];
  }


  getNecessaryData() {

    this.apiService.get('api/application-logs/settings').subscribe(
      res => {
        let logs = res.data;
        logs.forEach(element => {
          this.logs.push(this.newLogs(element))
        });

      }
    )
  }
  newLogs(data) {
    return this.fb.group({
      TypeName: data.TypeName,
      Status: data.Status,
      Id: data.Id,

    })
  }

  get logs(): FormArray {
    return this.AddFrom.get("LogSettings") as FormArray
  }

  goback() {
    this.router.navigate(['/dashboard/role']);
  }


  onSubmit() {

    this.apiService.put('api/application-logs/settings', this.AddFrom.value).subscribe(
      res => {
        this.showToast('success','Log settings updated successfully.');
        (<FormArray>this.AddFrom.get('LogSettings')).clear();
        this.ngOnInit();
      },
      err=>{
        this.showToast('danger',err.error.errors[0].message);
      })

  }
  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }
}




