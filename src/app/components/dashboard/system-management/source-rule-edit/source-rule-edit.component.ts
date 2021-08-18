import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-source-rule-edit',
  templateUrl: './source-rule-edit.component.html',
  styleUrls: ['./source-rule-edit.component.scss']
})
export class SourceRuleEditComponent implements OnInit {

  config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; };
  uniqueMessage: any;
  isLoading = false;
  sourceRuleEditForm: FormGroup;
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

    this.sourceRuleEditForm = this.fb.group({
        Id:[''],
        MessageFormat: [''],
        Rule:[''],
        Type:[''],
        Status:[''],
      }
    )
  }

  ngOnInit() {

    this.subscription = this.dataComm.getPassedItemData.subscribe(
      res =>{
        if(res){

        this.sourceRuleEditForm.patchValue({
          MessageFormat: res.messageFormat,
          Rule:res.rule,
          Type:res.type,
          Status:res.status,
          Id:res.id
        })
        console.log("passed data: ",res);
      }

    },

    )
  }


  goback(){
    this.router.navigate(['/dashboard/system-management/source-rule']);
  }


  onSourceSubmit() {
    console.log(this.sourceRuleEditForm.value);
    if(this.sourceRuleEditForm.valid){
      this.apiService.put('api/updateSourceRule',this.sourceRuleEditForm.value).subscribe(
        res=>{
          this.toastr.show("Success", 'Update Successful',);

          this.router.navigate(['/dashboard/system-management/source-rule']);
        }
      )
    }

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
