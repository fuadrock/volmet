import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup, ValidatorFn } from "@angular/forms";
import { passValidator } from "../passwordValidators";
import { Router } from "@angular/router";
import { DataCommunicationService } from "../../../../services/data-com/data-communication.service";
import { Subscription } from "rxjs";
import { ApiService } from "../../../../services/api.service";
import { NbToastrService, NbComponentStatus } from "@nebular/theme";
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
  selector: "ngx-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
})
export class UserEditComponent implements OnInit {
  subscription: Subscription;
  userEditForm: FormGroup;

  roles = [];
  isLoading = false;
  editedData: any;
  groupData: any;
  passEdit = false;
  submitted: boolean = false;
  fieldTextType: boolean;
  fieldTextTypeConfirm: boolean;

  constructor(
    private fb: FormBuilder,
    private dataComm: DataCommunicationService,
    private router: Router,
    private apiService: ApiService,
    private toaster: NbToastrService
  ) {
    this.userEditForm = this.fb.group(
      {
        Id: [""],
        Name: ['', [
          Validators.required,
          Validators.pattern('^[a-zA-Z][a-zA-Z ]{1,31}$'),
        ]],
        Username: ['', [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z0-9@.-_$!%*?&#]{3,31}$'), SpaceValidator.cannotContainSpace]],
        Status: ["ACTIVE", Validators.required],
        GroupIds: [[], Validators.required],
        Password: [""],
        confirmPassword: [""],
        ValidFrom: ["", Validators.required],
        ValidTo: ["", Validators.required],
      },
      {
        validators: [passValidator("Password", "confirmPassword"), DateRangeValidator],
      }
    );
  }

  ngOnInit() {
    this.subscription = this.dataComm.getPassedItemData.subscribe(
      (res) => {
        if (res) {
          let groupdIds = [];
          this.editedData = res;
          console.log(res);
          res.Groups.forEach((element) => {
            groupdIds.push(element.Id);
          });
          this.userEditForm.patchValue({
            Id: res.Id,
            Username: res.Username,
            Name: res.Name,
            Status: res.Status,
            GroupIds: groupdIds,
            ValidFrom: moment(res.ValidFrom, FORMAT),
            ValidTo: moment(res.ValidTo, FORMAT),
          });
          console.log("passed data: ", res);
        } else {
          this.router.navigate(["/dashboard/user"]);
        }
      },
      (err) => {
        this.router.navigate(["/dashboard/user"]);
      }
    );
    this.getNecessaryData();
  }
  getNecessaryData() {
    let pagination = "?pageNumber=0&pageSize=100";
    this.apiService.get("api/groups/assignable/active" + pagination).subscribe(
      (res) => {
        console.log(res.data);
        this.groupData = res.data;
      },
      (err) => {
        this.userEditForm.controls['GroupIds'].setErrors({noPermission: true})

       }
    );
  }
  changePass() {
    this.passEdit = !this.passEdit;
    if (this.passEdit) {
      this.userEditForm.controls['Password'].setValidators([Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@.-_$!%*?&#]).{8,32}$'), SpaceValidator.cannotContainSpace]);
      this.userEditForm.controls['confirmPassword'].setValidators([Validators.required,
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[@.-_$!%*?&#]).{8,32}$')]);
      this.userEditForm.controls['Password'].updateValueAndValidity();
      this.userEditForm.controls['confirmPassword'].updateValueAndValidity();
    }
    else {
      this.userEditForm.patchValue({
        Password: '',
        confirmPassword: '',
      });
      this.userEditForm.controls['Password'].clearValidators();
      this.userEditForm.controls['confirmPassword'].clearValidators();
      this.userEditForm.controls['Password'].updateValueAndValidity();
      this.userEditForm.controls['confirmPassword'].updateValueAndValidity();
    }
  }

  goback() {
    this.router.navigate(["/dashboard/user"]);
  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextTypeConfirm(){
    this.fieldTextTypeConfirm = !this.fieldTextTypeConfirm;
  }

  onSubmit() {
    this.submitted = true;
    if (this.userEditForm.valid && this.userEditForm.errors == null ) {
      let data = this.userEditForm.value;
      data.ValidFrom = moment(new Date(data.ValidFrom)).format(FORMAT);
      data.ValidTo = moment(new Date(data.ValidTo)).format(FORMAT);
      this.apiService
        .put("api/users/" + this.userEditForm.value.Id, data)
        .subscribe(
          (res) => {
            this.showToast("success", "User updated successfully.");
            this.router.navigate(["/dashboard/user"]);
          },
          (err) => {
            this.showToast("danger", err.error.errors[0].message);
          }
        );
    }else{
      console.log(this.userEditForm);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }
  get f() {
    return this.userEditForm.controls;
  }

  timeConverter(date) {
    let dd = date.split("-");
    return dd[2] + "/" + dd[1] + "/" + dd[0];
  }


}
