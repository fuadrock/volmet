import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { passValidator } from '../passwordValidators';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import * as _moment from "moment";
import { SpaceValidator } from '../../../../services/utils/validators';

const moment = _moment;
const FORMAT = "DD/MM/YYYY";


const DateRangeValidator: ValidatorFn = (fg: FormGroup) => {
  const start = fg.get('ValidFrom').value;
  const end = fg.get('ValidTo').value;
  return start !== null && end !== null && start < end ? null : { range: true };
};

@Component({
  selector: 'ngx-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})


export class AddUserComponent implements OnInit {
  emailPattern = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.+\.[a-zA-Z_.]+$";
  AddFrom: FormGroup;
  roles = [];
  groupData: any;
  submitted: boolean = false;
  minDate: Date = new Date();
  fieldTextType: boolean;
  fieldTextTypeConfirm: boolean;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toaster: NbToastrService
  ) {

    this.AddFrom = this.fb.group({
      Name: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z][a-zA-Z ]{1,31}$'),
      ]],
      Username: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9@.-_$!%*?&#]{3,31}$'), SpaceValidator.cannotContainSpace]],
      Status: ['ACTIVE', Validators.required],
      GroupIds: [[], Validators.required],
      Password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@.-_$!%*?&#]).{8,32}$'),
        SpaceValidator.cannotContainSpace
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@.-_$!%*?&#]).{8,32}$')
      ]],
      ValidFrom: ['', Validators.required],
      ValidTo: ['', Validators.required]
    }, {
      validators: [passValidator('Password', 'confirmPassword'), DateRangeValidator]
    }
    )
  }

  ngOnInit() {
    this.getNecessaryData();
  }
  getNecessaryData() {
    let pagination = '?pageNumber=0&pageSize=100';
    this.apiService.get('api/groups/assignable/active' + pagination).subscribe(
      res => {
        console.log(res.data);
        this.groupData = res.data
      },
      err => {
        this.AddFrom.controls['GroupIds'].setErrors({noPermission: true})
      }
    )

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextTypeConfirm(){
    this.fieldTextTypeConfirm = !this.fieldTextTypeConfirm;
  }

  goback() {
    this.router.navigate(['/dashboard/user']);
  }

  onSubmit() {

    this.submitted = true;
    if (this.AddFrom.valid && this.AddFrom.errors == null ) {
      let data = this.AddFrom.value;
      data.ValidFrom = moment(new Date(data.ValidFrom)).format(FORMAT);
      data.ValidTo = moment(new Date(data.ValidTo)).format(FORMAT);

      console.log(data);
      this.apiService.post('api/users', data).subscribe(
        res => {
          this.showToast('success', 'User added successfully.');
          this.router.navigate(['/dashboard/user']);
        },
        err => {
          this.showToast('danger', err.error?.errors[0]?.message ?? 'Erros connecting to server!');
        }
      )
    }
    else{
       console.log(this.AddFrom);
    }
  }

  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }
  get f() { return this.AddFrom.controls; }

  timeConverter(date) {
    let dd = date.split('-');
    return dd[2] + '/' + dd[1] + '/' + dd[0];
  }

  get aF() { return this.AddFrom.controls; }

}
