import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { DataCommunicationService } from '../../../../services/data-com/data-communication.service';

@Component({
  selector: 'ngx-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {

  isLoading = false;
  accessControlEditForm: FormGroup;
  updateId;


  subscription:Subscription;
  roleEditForm: FormGroup;
  roleData: any;
  submitted: boolean=false;

  constructor(
    private fb: FormBuilder,
    private apiService:ApiService,
    private router: Router,
    private dataComm:DataCommunicationService,
    private toastr:NbToastrService
  ) {

    this.roleEditForm = this.fb.group({
        Id:[''],
        Name: ['', [Validators.required,
        Validators.pattern('^[a-zA-Z][a-zA-Z0-9@.-_$!%*?&#]{3,31}$')]],
        Description: [''],
        Status:['ACTIVE',Validators.required],
        RolePermissions:this.fb.array([])
      }
    )
  }

  ngOnInit() {
    this.subscription = this.dataComm.getPassedItemData.subscribe(
      res =>{
        if(res){

        this.roleEditForm.patchValue({
          Name:res.Name,
          Status:res.Status,
          Id:res.Id,
          Description: res.Description,
        })

        this.apiService.get('api/roles/'+res.Id).subscribe(
          res=>{
            this.getNecessaryData();
            this.roleData = res.data;

         });
      }
      else{
        this.router.navigate(['/dashboard/role']);
      }
    },
    err=>{
      this.router.navigate(['/dashboard/role']);
    }
    )
  }
  getNecessaryData() {
    this.isLoading = true;
    this.apiService.get('api/access-controls').subscribe(
        res=>{
          this.isLoading = false;
          let accessControl = res.data;
          accessControl.forEach(element => {
            let control = this.newAccessControl(element);
            if(control){
              this.accessControls.push(control);
            }
           // this.accessControls.push( this.newAccessControl(element))
          });

        },
        err=>{
          this.isLoading = false;
        }
      );
  }

  getPermissionByName(data){
    let roles = this.roleData.AccessControls;
    var result =   roles.filter(element => element.Name === data.Name);
     return result[0]?.RolePermission?.Permission ??  '';
  }


  goback(){
    this.router.navigate(['/dashboard/role']);
  }
  get accessControls() : FormArray{
    return this.roleEditForm.get("RolePermissions") as FormArray
  }

  getControls(){
    return (<FormArray>this.roleEditForm.get("RolePermissions")).controls;
  }


  getName(i){
    return this.getControls()[i].value["Name"];
  }

  newAccessControl(data){
     let permission =  this.getPermissionByName(data);
    if(!permission){

      permission = 'NONE';
      return null;
    }
    return this.fb.group({
      AccessControlId:data.Id,
      Name:data.Name,
      Permission: permission,
      Status:'ACTIVE'
    })
  }

  onSubmit() {
    this.submitted = true;
    if(this.roleEditForm.valid){
      let data = this.roleEditForm.value;
      this.apiService.put('api/roles/'+this.roleEditForm.value.Id,data).subscribe(
        res=>{
          this.showToast("success", 'Role Updated successfully.');

          this.router.navigate(['/dashboard/role']);
        },
        err=>{
          this.showToast("danger", err.error.errors[0].message);
        }
      )
    }

  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  showToast(status: NbComponentStatus,message) {
    this.toastr.show(status, message, { status });
  }

  get f() { return this.roleEditForm.controls; }
}
