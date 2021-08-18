import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { NbDialogService, NbDialogRef, NbComponentStatus, NbToastrService, NbTooltipDirective } from "@nebular/theme";
import { EditModalComponent } from "./edit-modal/edit-modal.component";
import { FullScreenModalComponent } from "./full-screen-modal/full-screen-modal.component";
import { ServerLogModalComponent } from "./server-log-modal/server-log-modal.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ApiService } from "../../../services/api.service";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { ConfirmationModalComponent } from "../../../@theme/components/modal/confirmation-modal/confirmation-modal.component";
import { SchedulerService } from "../../../services/scheduler.service";
import { DataCommunicationService } from '../../../services/data-com/data-communication.service';
import { timer, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as sha512 from 'js-sha512';
import { EventLogModalComponent } from './event-log-modal/event-log-modal.component';
import { StorageService } from '../../../services/storage.service';
import { FullScreenDecodedTextComponent } from './full-screen-decoded-text/full-screen-decoded-text.component';


@Component({
  selector: "ngx-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {

  isLoading = false;
  logs = [];
  @ViewChild('tooltip') tooltipSync: NbTooltipDirective;
  // @ViewChild('tooltip') tooltipSync: MatTooltip;

  displayedColumns = ['id', 'tag', 'data'];
  textForm: FormGroup;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginateStartNo = 0;
  page = 0;
  size = 0;
  pageLength = 0;
  pageSizeOptions = [];
  isCardExpanded = false;
  start = "Start Broadcasting";
  manualStartbtn = "Start Broadcasting";
  //logs = [];
  statuses: string[];
  messages: string[];
  weight: number = 6;
  weightLog: number = 6;
  //audio player
  msaapDisplayTitle = true;
  msaapDisplayPlayList = true;
  msaapPageSizeOptions = [2, 4, 6];
  msaapDisplayVolumeControls = true;

  timedOut = false;
  edit = false;

  player: boolean = false;
  textData: any;
  subscription: Subscription;
  Weathersubscription: Subscription;
  decodedData: string;
  weather_data_subscription: Subscription;
  watherDataHash: any;
  decodedForm: FormGroup;
  permissions: any;
  current_permissions: any;
  canPlay: boolean = false;
  weatherEditPermission: any;
  canWeatherEdit: boolean = false;
  editWeatherChange: boolean = false;
  rawDecodedData: any;
  broadcastStatus: any=0;

  constructor(
    private dialogService: NbDialogService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private schedulerService: SchedulerService,
    private toaster: NbToastrService,
    private dataCom: DataCommunicationService,
    private storage: StorageService,

  ) {
    this.textForm = this.fb.group({
      Sources: this.fb.array([]),
    });

    this.decodedForm = this.fb.group({
      Data: [],
    });
    this.setPermission();

  }

  ngOnInit(): void {

    window.setInterval(() => {
      if (this.editWeatherChange) {
        this.tooltipSync.show();
      }
      else {
        // this.tooltipSync.hide();
      }

    }, 100);




    this.schedulerService.getWeatherData.subscribe((res) => {
      if (res) {
        this.textData = res.data;
        let textData = res.data;
        this.clearForm(textData)
        this.schedulerService.setMessageId(this.textData[0].MessageId);
        this.fetchDecodedData(this.textData[0].MessageId);

      }

    }, err => {
      console.log("errror received:", err);
    });


    this.schedulerService.getBroadcastStatus.subscribe(
      res => {

        this.broadcastStatus = res.status;

      }, err => {

      }
    );

    this.schedulerService.getWeatherStatus.subscribe(
      (res) => {
        if (res.data != this.edit) {
          this.edit = res.data;
        }
      },
      (err) => { }
    );



    this.weather_data_subscription = timer(0, 10000).pipe(
      switchMap(() => this.apiService.get('api/text/weather-data'))
    ).subscribe(res => {
      var hash = sha512.sha512(JSON.stringify(res.data));

      if (!this.watherDataHash) {
        this.watherDataHash = hash;
        this.textData = res.data;
        this.clearForm(this.textData);
        this.schedulerService.setMessageId(this.textData[0].MessageId);
        // if(this.canWeatherEdit){
        //   this.schedulerService.fetchWeatherStatus();
        // }
        this.schedulerService.fetchWeatherStatus();
        this.dataCom.setMessageId(this.textData[0].MessageId);
        this.fetchDecodedData(this.textData[0].MessageId);
      };
      if (this.watherDataHash !== hash) {
        this.watherDataHash = hash;
        this.textData = res.data;
        let textsData = res.data;
        this.clearForm(textsData);
        this.schedulerService.setMessageId(this.textData[0].MessageId)
        this.editWeatherChange = false;
        this.dataCom.setMessageId(this.textData[0].MessageId);
        this.fetchDecodedData(this.textData[0].MessageId);
        this.showToast('success', 'New weather data found!')

      }


    });


  }



  get texts(): FormArray {
    return this.textForm.get("Sources") as FormArray;
  }
  clearForm(textData) {
    var control = <FormArray>this.textForm.controls['Sources'];
    control.clear();
    if (control.length == 0) {

      textData.forEach((element) => {
        this.texts.push(this.newTexts(element));
      });
    }

  }

  fetchDecodedData(id) {

    this.apiService.get(`api/text/weather-data/decoded/${id}`).subscribe(
      res => {
        this.rawDecodedData = res.data;
        let response = res.data;
        this.dataSource = new MatTableDataSource(res.data);
        let decodedData = '';
        response.forEach((element) => {
          decodedData += element.Data + '\n\n';
        })
        this.decodedData = decodedData;

        this.decodedForm.patchValue({
          Data: this.decodedData
        })

      });
  }

  getTexts() {
    return (<FormArray>this.textForm.get("Sources")).controls;
  }

  newTexts(data) {
    return this.fb.group({
      Id: data.Id,
      Tag: data.Tag.replace('**', ''),
      Data: data.Data,
      MessageId: data.MessageId,
    });
  }



  getTag(i) {
    return this.getTexts()[i].value["Tag"];
  }
  clearLock() {
    this.dialogService.open(ConfirmationModalComponent, {
      context: {
        message: "Are you sure clear lock weather data?",
      },
    })
      .onClose.subscribe((value) => {
        if (value == 1) {
          this.apiService
            .put(`api/text/weather-data/overwrite/${this.textData[0].MessageId}`)
            .subscribe(
              (res) => {
                this.showToast('success', 'Weather data lock removed successfully.');

              },
              (err) => {
                this.showToast('danger', err.error.errors[0].message)
              }
            );
        }
      });
  }

  modal(i) {

    if (!this.edit) {
      this.showToast('danger', "Someone is already editing weather data!");
    }
    else {
      this.isLoading = true;
      this.apiService.get(`api/text/weather-data/status/${this.textData[0].MessageId}`)
        .subscribe(res => {
          this.isLoading = false;
          if (res.data) {
            this.apiService
              .put(`api/text/weather-data/status/${this.textData[0].MessageId}?editable=false`, {
                editable: false,
              })
              .subscribe(
                (res) => {
                  // this.edit = true;
                },
                (err) => { }
              );

            this.dialogService
              .open(EditModalComponent, {
                closeOnBackdropClick: false,
                context: {
                  title: this.getTexts()[i].value["Tag"],
                  value: this.getTexts()[i].value["Data"],
                  msgId: this.textData[0].MessageId,
                },
              })
              .onClose.subscribe((value) => {

                if (typeof value !== "undefined") {
                  if (value !== this.textData[i].Data) {
                    this.editWeatherChange = true;

                  }
                  else {
                    this.editWeatherChange = false;
                    this.tooltipSync.hide();

                  }
                  this.getTexts()[i].patchValue({
                    Data: value,
                  });
                }
              });

          }
        },
          err => {
            this.isLoading = false;
            this.showToast('danger', err.error.errors[0].message)
          })



    }
  }

  full() {
    if (!this.edit) {
      this.showToast('danger', "Someone is already editing weather data or you don't have permission to edit!");
    }
    else {

      this.isLoading = true;
      this.apiService.get(`api/text/weather-data/status/${this.textData[0].MessageId}`)
        .subscribe(res => {
          this.isLoading = false;
          if (res.data) {
            this.apiService
              .put(`api/text/weather-data/status/${this.textData[0].MessageId}?editable=false`, {
                editable: false,
              })
              .subscribe(
                (res) => {

                },
                (err) => { }
              );
            this.dialogService.open(FullScreenModalComponent, {
              context: { logs: this.textForm.value.Sources, canEdit: this.canWeatherEdit },
            }).onClose.subscribe((value) => {
              value.every((element, index) => {
                if (element.Data !== this.textData[index].Data) {
                  this.editWeatherChange = true;
                  this.tooltipSync.show();
                  return false;
                }
                else {
                  this.editWeatherChange = false;
                  this.tooltipSync.hide();
                  return true;
                }
              });
              if (this.editWeatherChange) {
                this.clearForm(value);
              }

            });
          }
        },
          err => {
            this.isLoading = false;
            this.showToast('danger', err.error.errors[0].message)

          })

    }
  }

  fullDecodedData() {
    this.dialogService.open(FullScreenDecodedTextComponent, {
      context: { data: this.decodedData },
    });
  }

  fullLogStatus() {
    this.dialogService.open(EventLogModalComponent, {
      context: { title: 'Event Logs' },
    });
  }

  fullServerStatus() {
    this.dialogService.open(ServerLogModalComponent, {
      context: { title: 'Server Logs' },
    });
  }

  play() {
    this.player = !this.player;
  }

  setPermission() {
    this.permissions = this.storage.getRoleData();
    var result = this.permissions.filter(element => element.Name === 'R_AUDIO');
    this.current_permissions = result[0];
    if (this.current_permissions.RolePermission.Permission == 'READ') {
      this.canPlay = true;
    }

    var w_permission = this.permissions.filter(element => element.Name === 'RW_WEATHER_DATA');
    this.weatherEditPermission = w_permission[0];
    if (this.weatherEditPermission.RolePermission.Permission == 'WRITE') {
      this.canWeatherEdit = true;
    }

  }

  onSubmit() { }

  decodeSubmit() {

  }

  SyncTextData() {
    if (!this.editWeatherChange) {
      this.showToast('danger', "No changes to sync weather data!");
    }
    else {
      if(this.broadcastStatus){
        this.showToast('danger', "Weather data sync cannot be performed at this moment. Please try again after finishing broadcast!");
        return;
      }
      this.dialogService
        .open(ConfirmationModalComponent, {
          context: {
            message: "Are you sure sync current changes?",
          },
        })
        .onClose.subscribe((value) => {
          if (value == 1) {
            this.apiService
              .put(
                `api/text/weather-data/${this.textData[0].MessageId}`,
                this.textForm.value
              )
              .subscribe(
                (res) => {
                  this.showToast('success', 'Weather data saved successfully.');
                  this.editWeatherChange = false;
                },
                (err) => {
                  this.showToast('danger', err.error.errors[0].message)
                }
              );
          }
        });
    }
  }

  showToast(status: NbComponentStatus, message) {
    this.toaster.show(status, message, { status });
  }
  ngOnDestroy() {
    if (this.weather_data_subscription) {
      this.weather_data_subscription.unsubscribe();
    }
    this.schedulerService.stopWeatherStatus();
    this.editWeatherChange = false;
  }
}
