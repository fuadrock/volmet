import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogRef, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../../../services/api.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ngx-full-screen-modal',
  templateUrl: './full-screen-modal.component.html',
  styleUrls: ['./full-screen-modal.component.scss']
})
export class FullScreenModalComponent implements OnInit, OnDestroy {

  @Input() logs: any[];
  @Input() canEdit: boolean;
  @Input() value: string;
  textForm: FormGroup;
  timedOut: boolean = false;
  msgId: any;
  subscription: Subscription;
  overwrittenSubscription: Subscription;
  changes: boolean = false;
  count = 0;
  specialChars = '_,.=/-';
  weatherPattern: string | RegExp = '^[a-zA-Z0-9 _,.=@\/-]*$';

  constructor(protected ref: NbDialogRef<FullScreenModalComponent>, private toaster: NbToastrService, private fb: FormBuilder, private apiService: ApiService, private bnIdle: BnNgIdleService) {
    this.textForm = this.fb.group({
      Sources: this.fb.array([]),
    });

    this.subscription = this.bnIdle.startWatching(60).subscribe((isTimedOut: boolean) => {

      this.timedOut = true;

      this.bnIdle.stopTimer();

      this.apiService.put(`api/text/weather-data/status/${this.msgId}?editable=true`, { editable: true }).subscribe(
        res => {
          this.ref.close(this.textForm.value.Sources);
        },
        err => {

        }
      )
    });
  }
  changeValue(i) {

    if (this.logs[i].Data != this.texts.controls[i].value.Data) {
      this.logs[i].change = true;
      if (!this.texts.controls[i].value.Tag.includes('**')) {
        this.texts.controls[i].patchValue({
          Tag: this.texts.controls[i].value.Tag + '**',
        })
      }

    } else {
      this.logs[i].change = false;
      this.texts.controls[i].patchValue({
        Tag: this.texts.controls[i].value.Tag.replace('**', ''),
      })
    }
    let data = false;
    this.logs.forEach((log, i) => {
      if (log.change) {
        data = log.change;
      }
    });
    this.changes = data;
  }

  ngOnInit() {
    this.clearForm(this.logs);

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
          this.texts.controls.forEach(c=>{
            c.get('Data').clearValidators();
            c.get('Data').setValidators([Validators.required,Validators.pattern(pattern)]);
            c.updateValueAndValidity();
          })


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
        this.closeAndClear();
      }
    },
      err => {

      })

  }

  get texts(): FormArray {
    return this.textForm.get("Sources") as FormArray;
  }

  clearForm(textData) {
    var control = <FormArray>this.textForm.controls['Sources'];
    control.clear();
    this.msgId = textData[0].MessageId;
    textData.forEach((element) => {
      this.texts.push(this.newTexts(element));
    });
  }

  getTag(i) {
    return this.getTexts()[i].value["Tag"];
  }

  getTexts() {
    return (<FormArray>this.textForm.get("Sources")).controls;
  }

  newTexts(data) {
    return this.fb.group({
      Id: data.Id,
      Tag: data.Tag,
      Data: [data.Data, [Validators.required, Validators.pattern(this.weatherPattern)]],
      MessageId: data.MessageId,
    });
  }

  save() {
    if (this.textForm.valid) {
      this.bnIdle.stopTimer();
      if (this.timedOut == false) {
        this.apiService.put(`api/text/weather-data/status/${this.msgId}?editable=true`, { editable: true }).subscribe(
          res => {

          },
          err => {
          }
        );
        this.ref.close(this.textForm.value.Sources);
      }
      else {
        this.ref.close(this.textForm.value.Sources);
      }
    }
  }
  closeAndClear() {
    this.close();
    this.save();
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


  ngOnDestroy() {
    this.bnIdle.stopTimer();
    this.subscription.unsubscribe();
    if (this.overwrittenSubscription) {
      this.overwrittenSubscription.unsubscribe();
    }
  }
  close() {
    this.changes = false;
    this.clearForm(this.logs);
  }

  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }
}
