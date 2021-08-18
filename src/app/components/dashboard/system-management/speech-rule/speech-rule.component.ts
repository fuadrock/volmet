import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'ngx-speech-rule',
  templateUrl: './speech-rule.component.html',
  styleUrls: ['./speech-rule.component.scss']
})
export class SpeechRuleComponent implements OnInit {

  config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; };
  isLoading = false;
  sourceRuleAddForm: FormGroup;
  speechRuleAddForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private apiService:ApiService,
    private router: Router,
  ) {
    this.config = {
      timeOut: 5000,
      closeButton: true,
      positionClass: 'toast-top-right',
      enableHtml: true,
    };

    this.sourceRuleAddForm = this.fb.group({
        MessageFormat: [''],
        Rule:[''],
        Type:[''],
        Status:['ACTIVE'],

      });
      this.speechRuleAddForm = this.fb.group({
        MessageFormat: [''],
        Rule:[''],
        Type:[''],
        Status:['ACTIVE'],

      })
  }

  ngOnInit() {
  }


  goback(){
    this.router.navigate(['/dashboard/system-management/source-rule']);
  }


  onSourceSubmit() {
    console.log(this.sourceRuleAddForm.value);
    if(this.sourceRuleAddForm.valid){
      this.apiService.post('api/insertSourceRule',this.sourceRuleAddForm.value).subscribe(
        res=>{
          this.router.navigate(['/dashboard/system-management/source-rule']);
        }
      )
    }

  }

  onSpeechSubmit(){
    console.log(this.speechRuleAddForm.value);
    if(this.speechRuleAddForm.valid){
      this.apiService.post('api/insertSpeechRule',this.speechRuleAddForm.value).subscribe(
        res=>{
          this.router.navigate(['/dashboard/system-management/speech-rule']);
        }
      )
    }
  }

}
