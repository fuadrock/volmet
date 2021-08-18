import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { NbDialogService } from '@nebular/theme';
import { ApiService } from '../../../../services/api.service';
import { StorageService } from '../../../../services/storage.service';
import { HolidayModalComponent } from '../holiday-modal/holiday-modal.component';
@Component({
  selector: 'ngx-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  holidays: any = [];
  currentEvent: any;
  permissions: any;
  viewReport: boolean = false;
  writeReport: boolean = false;

  constructor(private dialogService: NbDialogService, private apiService: ApiService, private storage: StorageService) { }

  calendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    events: this.holidays
  };

  ngOnInit(): void {
    this.apiService.get('api/configuration-settings/holiday').subscribe(
      res => {
        console.log(res.data);
        this.holidays = res.data;
        this.calendarOptions.events = this.holidays;

      },
      err => {

      });
      this.setPermission();
  }

  setPermission() {
    this.permissions = this.storage.getRoleData();
    var readReport = this.permissions.filter(element => element.Name === 'RW_SYSTEM_CONFIGURATION')[0];
    if (readReport.RolePermission.Permission == 'WRITE') {
      this.writeReport = true;
      this.viewReport = true;
    }
    if (readReport.RolePermission.Permission == 'READ') {
      this.viewReport = true;
    }
  }

  handleDateClick(arg) {
    if (this.writeReport) {
      this.currentEvent = this.holidays.find(data => data.date === arg.dateStr);
      this.dialogService.open(HolidayModalComponent, {
        context: {
          event: this.currentEvent
        },
      }).onClose.subscribe(value => {

        if (value && value != 1) {
          let data = {
            date: arg.dateStr,
            title: value
          };

          this.apiService.post('api/configuration-settings/holiday', data).subscribe(
            res => {

              this.ngOnInit();

            },
            err => {

            }
          )
        }
        else if (value == 1) {
          this.apiService.delete(`api/configuration-settings/holiday?id=${this.currentEvent.id}`).subscribe(
            res => {
              this.ngOnInit();
            },
            err => {

            }
          )
        }

      })
    }
  }

}
