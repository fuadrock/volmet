import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ApiService } from "../../../services/api.service";
import { StorageService } from "../../../services/storage.service";
import { NbComponentStatus } from "@nebular/theme";
import { NbToastrService } from "@nebular/theme";
import { DataCommunicationService } from "../../../services/data-com/data-communication.service";
import { NbDialogService } from "@nebular/theme";

@Component({
  selector: "ngx-login-component",
  templateUrl: "./login-component.component.html",
  styleUrls: ["./login-component.component.scss"],
})

export class LoginComponentComponent implements OnInit {
  isLoading = false;
  submitted = false;
  loginForm: FormGroup;
  user = { email: "", password: "" };
  checkoutForm: any;
  loggedIn: boolean = false;
  groupSelector = false;
  authForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });
  groups: any;
  groupForm: FormGroup;

  flipped = false;
  success = false;
  danger = false;
  message: any;
  fieldTextType: boolean;
  constructor(
    private fb: FormBuilder,
    private toastr: NbToastrService,
    private storage: StorageService,
    private apiService: ApiService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      Username: ['', [Validators.required]],
      password: ["",  [Validators.required,Validators.minLength(8)]],
      Signature: [Date.now(), Validators.required],
    });

    this.groupForm = this.fb.group({
      GroupId: ["", Validators.required],

    });
  }

  ngOnInit(): void {
  }

  back() {
    this.groupSelector = false;
    this.toggleView();

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnDestroy(): void {

  }

  groupSubmit() {
    if (this.groupForm.valid) {
      let data = this.loginForm.value;
      data.GroupId = this.groupForm.value.GroupId;
      data.Signature = Date.now();
      this.isLoading = true;
      this.apiService.login('api/auth/token', data).subscribe(
        res => {
          this.isLoading = false;
          this.storage.setAccessToken(res.data);
          this.storage.getUserData();
          this.success = true;
          this.danger = false;
          this.router.navigate(['dashboard']);
        },
        err => {
          this.isLoading = false;
          this.message = err.error?.errors[0]?.message??'Error connecting to server!';
          this.success = false;
          this.danger = true;
        }
      )
    }
  }

  onSubmit() {


    this.submitted = true;
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.apiService.login("api/auth", this.loginForm.value).subscribe(
        res => {
          this.isLoading = false;
          let data = this.loginForm.value;
          this.groups = res.data.Groups;
          if (this.groups.length == 1) {
            data.GroupId = this.groups[0].Id;
            data.Signature = Date.now();
            this.apiService.login('api/auth/token', data).subscribe(
              res => {
                this.storage.setAccessToken(res.data);
                this.storage.getUserData();
                this.success = true;
                this.danger = false;
                this.router.navigate(['dashboard']);
              },
              err => {

                this.message = err.error?.errors[0]?.message??'Error connecting to server!';
                this.success = false;
                this.danger = true;
              }
            )
          }
          else if (this.groups.length > 1) {
            this.groupSelector = true;
            this.toggleView();
            this.danger = false;
          }
          else {
            this.danger = true;

          }
        },
        err => {
          console.log("error")
          this.isLoading = false;
          this.danger = true;
          this.message = err.error?.errors[0]?.message??'Error connecting to server!';
        }
      );
    }
  }

  toggleView() {
    this.flipped = !this.flipped;
  }


  login() {
    this.router.navigate(["dashboard/home"]);
  }

  isAuthenticated() {
    return this.loggedIn;
  }

  get Username() {
    return this.loginForm.get("Username");
  }

  get password() {
    return this.loginForm.get("password");
  }

  showToast(status: NbComponentStatus, message) {
    this.toastr.show(status, message, { status });
  }
}
