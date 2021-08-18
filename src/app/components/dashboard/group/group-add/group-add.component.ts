import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';

@Component({
  selector: 'ngx-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {

  AddFrom: FormGroup;
  facultyData = [];
  roles = [];
  userData: any;
  roleData: any;
  submitted: boolean = true;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private toaster: NbToastrService
  ) {
    this.AddFrom = this.fb.group({
      Name: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z][a-zA-Z0-9@.\-_$!%*?&#]{3,31}$')]],
      Description: [''],
      Status: ['ACTIVE', Validators.required],
      RoleIds: [[], Validators.required],
    })
  }

  ngOnInit() {
    this.getNecessaryData();
  }

  getNecessaryData() {
    let pagination = '?pageNumber=0&pageSize=1000';
    this.apiService.get('api/roles/assignable/active' + pagination).subscribe(
      res => {
        console.log(res.data);
        this.roleData = res.data
      },
      err => {
        this.AddFrom.controls['RoleIds'].setErrors({ noPermission: true })
      })
  }
  goback() {
    this.router.navigate(['/dashboard/group']);
  }

  onSubmit() {
    this.submitted = true;
    if (this.AddFrom.valid) {
      this.apiService.post('api/groups', this.AddFrom.value).subscribe(
        res => {
          this.showToast('success', 'Group added successfully.')
          this.router.navigate(['/dashboard/group']);
        },
        err => {
          this.showToast('danger', err.error.errors[0].message)
        }
      )
    }
  }
  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }
  get f() { return this.AddFrom.controls; }

}
