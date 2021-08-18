import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { MatProgressButtonOptions } from "mat-progress-buttons";

import { Router } from "@angular/router";
import { ApiService } from "../../../../../services/api.service";
import { DataCommunicationService } from "../../../../../services/data-com/data-communication.service";
import { NbToastrService } from "@nebular/theme";
import { Subscription } from "rxjs";

@Component({
  selector: "ngx-configuration-edit",
  templateUrl: "./configuration-edit.component.html",
  styleUrls: ["./configuration-edit.component.scss"],
})
export class ConfigurationEditComponent implements OnInit {
  config: {
    timeOut: number;
    closeButton: boolean;
    positionClass: string;
    enableHtml: boolean;
  };
  uniqueMessage: any;
  isLoading = false;
  configurationEditComponentForm: FormGroup;
  updateId;

  saveBtn: MatProgressButtonOptions = {
    active: false,
    text: "Save",
    spinnerSize: 19,
    raised: true,
    stroked: false,
    buttonColor: "accent",
    fullWidth: false,
    disabled: false,
    mode: "indeterminate",
  };
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private dataComm: DataCommunicationService,
    private toastr: NbToastrService
  ) {
    this.config = {
      timeOut: 5000,
      closeButton: true,
      positionClass: "toast-top-right",
      enableHtml: true,
    };

    this.configurationEditComponentForm = this.fb.group({
      Id: [""],
      Key: [""],
      Value: [""],
    });
  }

  ngOnInit() {
    this.subscription = this.dataComm.getPassedItemData.subscribe((res) => {
      if (res) {
        this.configurationEditComponentForm.patchValue({
          Name: res.Name,
          Status: res.Status,
          Id: res.Id,
        });
      }
    });
  }

  goback() {
    this.router.navigate(["/dashboard/configurations"]);
  }

  onSubmit() {
    console.log(this.configurationEditComponentForm.value);
    if (this.configurationEditComponentForm.valid) {
      this.apiService
        .put(
          "api/configurations/" + this.configurationEditComponentForm.value.Id,
          this.configurationEditComponentForm.value
        )
        .subscribe((res) => {
          this.toastr.show("Success", "Update Successful");
          this.router.navigate(["/dashboard/configurations"]);
        });
    }
  }
}
