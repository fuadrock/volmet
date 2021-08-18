import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { NbComponentStatus, NbDialogRef, NbToastrService } from '@nebular/theme';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit, OnDestroy {


  @Input() title: string;
  @Input() value: string;
  @Input() msgId: string;
  timedOut: boolean = false;
  subscription: Subscription;
  overwrittenSubscription: Subscription;
  editedData: FormControl;
  specialChars = '_,.=/-';


  constructor(protected ref: NbDialogRef<EditModalComponent>,
    private apiService: ApiService, private bnIdle: BnNgIdleService,
    private toaster: NbToastrService,) {


    this.subscription = this.bnIdle.startWatching(60).subscribe((isTimedOut: boolean) => {

      this.bnIdle.stopTimer();
      this.apiService.put(`api/text/weather-data/status/${this.msgId}?editable=true`, { editable: true }).subscribe(
        res => {
          this.ref.close();
        },
        err => {

        }
      )
    });
  }
  ngOnInit() {
    this.editedData = new FormControl(this.value, [Validators.required, Validators.pattern('^[a-zA-Z0-9 _,.=\/-]*$')]);

    this.apiService.get('api/configuration-settings/allowed-chars').subscribe(
      res => {
        if (res.data) {

          let pattern = '';
          let chars = this.findUnique(res.data);

          chars = chars.replace(/[a-zA-Z0-9]/g, "");
          chars = chars.replace(/ /g, '');
          chars = chars.replace(/^/g, '');
          chars = chars.replace(/\//g, "\\/");

          if (chars.includes('-')) {
            chars = chars.replace(/-/g, '');
            pattern = '^[a-zA-Z0-9 ' + chars + '-' + ']*$';
            this.specialChars = chars.replace(/\\/g, '');
            this.specialChars = this.specialChars + '-';
          }
          else {
            this.specialChars = chars.replace(/\\/g, '');
            pattern = '^[a-zA-Z0-9 ' + chars + ']*$';
          }

          this.editedData.setValidators([]);
          this.editedData.setValidators([Validators.required, Validators.pattern(pattern)])
        }
      },
      err => {

      }
    );


    this.overwrittenSubscription = timer(1000, 2000).pipe(
      switchMap(() => this.apiService.get(`api/text/weather-data/lock-overwrite-status/${this.msgId}`))
    ).subscribe(res => {
      if (res.data?.Overwrite == true) {
        this.showToast('danger', `Weather data edit lock has been overwritten by ${res.data.OverwrittenBy}!`)
        this.ref.close();
      }
    },
      err => {

      })
  }

  findUnique(str) {
    let uniq = "";
    for (let i = 0; i < str.length; i++) {
      if (uniq.includes(str[i]) === false) {
        uniq += str[i]
      }
    }
    return uniq;
  }

  dismiss() {
    this.bnIdle.stopTimer();
    this.apiService.put(`api/text/weather-data/status/${this.msgId}?editable=true`, { editable: true }).subscribe(
      res => {

      },
      err => {
      }
    );
    this.ref.close();
  }

  save(value) {
    if (this.editedData.valid) {
      this.bnIdle.stopTimer();
      this.apiService.put(`api/text/weather-data/status/${this.msgId}?editable=true`, { editable: true }).subscribe(
        res => {

        },
        err => {
        }
      );
      this.ref.close(value);
    }
  }

  ngOnDestroy() {
    this.bnIdle.stopTimer();
    this.subscription.unsubscribe();
    if (this.overwrittenSubscription) {
      this.overwrittenSubscription.unsubscribe();
    }
  }
  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }
  getErrorMessage() {
    if (this.editedData.hasError('required')) {
      return 'You must enter a value';
    }
    return this.editedData.hasError('pattern') ? `Not a valid weather data! Allowed special characters(${this.specialChars})` : '';
  }
}

