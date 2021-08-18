import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';
import { Subscription } from 'rxjs';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';

@Component({
  selector: 'ngx-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {
  roles = [];
  userData: any;
  roleData: any;
  editFrom: FormGroup;
  subscription: Subscription;
  submitted: boolean = false;
  isLoading = false;


  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private dataComm: DataCommunicationService,
    private toaster: NbToastrService,
  ) {
    this.editFrom = this.fb.group({
      Id: [''],
      Name: ['', [Validators.required,
      Validators.pattern('^[a-zA-Z][a-zA-Z0-9@.\-_$!%*?&#]{3,31}$')]],
      Description: [''],
      Status: ['', Validators.required],
      RoleIds: [[], Validators.required],
    }
    )
  }

  ngOnInit() {

    this.isLoading = true;
    this.subscription = this.dataComm.getPassedItemData.subscribe(
      res => {
        if (res) {

          let assignedRoles = [];
          this.apiService.get('api/groups/' + res.Id).subscribe(
            response => {
              this.isLoading = false;
              let roles = response.data.Roles;
              roles.forEach(element => {
                assignedRoles.push(element.Id);
              });
              this.editFrom.patchValue({
                Id: res.Id,
                Name: res.Name,
                Status: res.Status,
                Description: res.Description,
                RoleIds: assignedRoles
              });
              this.getNecessaryData();
            },
            err =>{
              this.isLoading = false;
            }
            );
        }
        else {
          this.isLoading = false;
          this.router.navigate(['/dashboard/group']);
        }
      },
      err => {
        this.router.navigate(['/dashboard/group']);

      })
  }

  getNecessaryData() {
    let pagination = '?pageNumber=0&pageSize=1000';
    this.apiService.get('api/roles/assignable/active' + pagination).subscribe(
      res => {

        this.roleData = res.data
      },
      err => {
        this.editFrom.controls['RoleIds'].setErrors(null);
        this.editFrom.controls['RoleIds'].setErrors({ noPermission: true })
      }
    )
  }


  goback() {
    this.router.navigate(['/dashboard/group']);
  }


  onSubmit() {
    this.submitted = true;

    if (this.editFrom.valid) {
      this.apiService.put('api/groups/' + this.editFrom.value.Id, this.editFrom.value).subscribe(
        res => {
          this.showToast('success', 'Group update successful.')
          this.router.navigate(['/dashboard/group']);
        },
        err => {
          this.showToast('danger', err.error.errors[0].message)
        }
      )
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }

  get f() { return this.editFrom.controls; }
}
