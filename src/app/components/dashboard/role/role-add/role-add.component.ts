import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatProgressButtonOptions } from 'mat-progress-buttons';

import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';

@Component({
  selector: 'ngx-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {


  AddFrom: FormGroup;
  roles = [];
  isLoading = false;
  roleAddForm: FormGroup;
  submitted: boolean = false;


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
    private apiService: ApiService,
    private router: Router,
    private toastr: NbToastrService

  ) {

    this.roleAddForm = this.fb.group({
      Name: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z][a-zA-Z0-9@.-_$!%*?&#]{3,31}$')]],
      Description: [''],
      Status: ['ACTIVE', Validators.required],
      RolePermissions: this.fb.array([])
    })
  }

  ngOnInit() {
    this.getNecessaryData();
  }

  get accessControls(): FormArray {
    return this.roleAddForm.get("RolePermissions") as FormArray
  }

  getNecessaryData() {
    this.apiService.get('api/access-controls/assignable').subscribe(
      res => {
        let accessControl = res.data;
        accessControl.forEach(element => {
          this.accessControls.push(this.newAccessControl(element))
        });

      }
    )

  }

  getControls() {
    return (<FormArray>this.roleAddForm.get("RolePermissions")).controls;
  }


  getName(i) {
    return this.getControls()[i].value["Name"];
  }

  newAccessControl(data) {
    return this.fb.group({
      AccessControlId: data.Id,
      Name: data.Name,
      Permission: 'NONE',
      Status: 'ACTIVE'
    })
  }


  goback() {
    this.router.navigate(['/dashboard/role']);
  }


  onSubmit() {
    this.submitted = true;
    if (this.roleAddForm.valid) {
      let data = this.roleAddForm.value;
      this.apiService.post('api/roles', data).subscribe(
        res => {
          this.showToast("success", 'Role added successfully.');

          this.router.navigate(['/dashboard/role']);
        },
        err => {
          this.showToast("danger", err.error.errors[0].message);
        }
      )
    }

  }

  showToast(status: NbComponentStatus, message) {
    this.toastr.show(status, message, { status });
  }

  get f() { return this.roleAddForm.controls; }
}
