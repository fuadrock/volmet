import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'ngx-access-control-add',
  templateUrl: './access-control-add.component.html',
  styleUrls: ['./access-control-add.component.scss']
})
export class AccessControlAddComponent implements OnInit {

  phonePattern = "^[0-9]{1}[0-9]{10}";
  emailPattern = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.+\.[a-zA-Z_.]+$";
  config: { timeOut: number; closeButton: boolean; positionClass: string; enableHtml: boolean; };
  AddFrom: FormGroup;
  designationData = [];
  departmentData = [];
  facultyData = [];
  roles = [];
  uniqueMessage: any;
  file: any;
  ResponsibilityData: any;
  regionData: any;
  isLoading = false;
  roleAddForm: FormGroup;
  accessControlAddForm: FormGroup;

  passwordValidator(form: FormGroup) {
    const condition = form.get('password').value !== form.get('confirmPassword').value;
    return condition ? {passwordsDoNotMatch: true} : null;
  }
  selectedItem = [1,2];
  selectedGroup = [1];

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

    this.accessControlAddForm = this.fb.group({
        name: [''],

        status:[''],

      }
    )
  }

  ngOnInit() {


   // this.getNecessaryData();
  }


  goback(){
    this.router.navigate(['/dashboard/access-control']);
  }


  onSubmit() {
    console.log(this.accessControlAddForm.value);
    if(this.accessControlAddForm.valid){
      this.apiService.post('api/access-controls',this.accessControlAddForm.value).subscribe(
        res=>{
          this.router.navigate(['/dashboard/access-control']);
        }
      )
    }

  }


  // loadFile(event: any) {
  //   if (event.target.files && event.target.files.length) {
  //     this.file = event.target.files[0];
  //   }
  // }
}
