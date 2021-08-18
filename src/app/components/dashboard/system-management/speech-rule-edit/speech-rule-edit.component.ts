import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { Router } from '@angular/router';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-speech-rule-edit',
  templateUrl: './speech-rule-edit.component.html',
  styleUrls: ['./speech-rule-edit.component.scss']
})
export class SpeechRuleEditComponent implements OnInit {

  config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; };
  uniqueMessage: any;
  isLoading = false;
  speechRuleEditForm: FormGroup;
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

    this.speechRuleEditForm = this.fb.group({
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

        this.speechRuleEditForm.patchValue({
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
    this.router.navigate(['/dashboard/system-management/speech-rule']);
  }


  onspeecheSubmit() {
    console.log(this.speechRuleEditForm.value);
    if(this.speechRuleEditForm.valid){
      this.apiService.put('api/updateSpeechRule',this.speechRuleEditForm.value).subscribe(
        res=>{
          this.toastr.show("Success", 'Update Successful',);

          this.router.navigate(['/dashboard/system-management/speech-rule']);
        }
      )
    }

  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
