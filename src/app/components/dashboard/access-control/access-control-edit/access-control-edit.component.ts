import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';
import { NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-access-control-edit',
  templateUrl: './access-control-edit.component.html',
  styleUrls: ['./access-control-edit.component.scss']
})
export class AccessControlEditComponent implements OnInit {

  config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; };
  uniqueMessage: any;
  isLoading = false;
  accessControlEditForm: FormGroup;
  updateId;

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
  subscription:Subscription;

  constructor(
    private fb: FormBuilder,
    private apiService:ApiService,
    private router: Router,
    private dataComm:DataCommunicationService,
    private toastr:NbToastrService
  ) {
    this.config = {
      timeOut: 5000,
      closeButton: true,
      positionClass: 'toast-top-right',
      enableHtml: true,
    };

    this.accessControlEditForm = this.fb.group({
        Id:[''],
        Name: [''],
        Status:[''],
      }
    )
  }

  ngOnInit() {

    this.subscription = this.dataComm.getPassedItemData.subscribe(
      res =>{
        if(res){

        this.accessControlEditForm.patchValue({
          Name:res.Name,
          Status:res.Status,
          Id:res.Id
        })
        console.log("passed data: ",res);
      }

    },

    )
  }


  goback(){
    this.router.navigate(['/dashboard/access-control']);
  }


  onSubmit() {
    console.log(this.accessControlEditForm.value);
    if(this.accessControlEditForm.valid){
      this.apiService.put('api/access-controls/'+this.accessControlEditForm.value.Id,this.accessControlEditForm.value).subscribe(
        res=>{
          this.toastr.show("Success", 'Update Successful',);

          this.router.navigate(['/dashboard/access-control']);
        }
      )
    }

  }

}
