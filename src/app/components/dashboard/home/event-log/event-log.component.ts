import { Component, OnInit, ViewChild } from '@angular/core';
import {  FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { ApiService } from '../../../../services/api.service';
import {  Subscription } from 'rxjs';
import { SchedulerService } from '../../../../services/scheduler.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
};
@Component({
  selector: 'ngx-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class EventLogComponent implements OnInit {

  displayedColumns = ['time', 'message'];
  dataSource = new MatTableDataSource();
  paginateStartNo = 0;
  page = 0;
  size = 100;
  pageLength = 0;
  pageSizeOptions = [5, 10, 15, 20];
  pageSort;
  searchForm: FormGroup;
  isLoading = false;
  authData = {};

  programList = [];
  courseList = [];
  log: any;
  subscription: Subscription;
  filter: boolean = true;
  //private fetchData$: Observable<any> = this.apiService.get('api/application-logs?types="EVENT"');
  alertForError = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private schedulerService: SchedulerService
  ) {
  }

  ngOnInit() {
    let audio = new Audio('assets/audio/beep.mp3');
    audio.load();
    this.subscription = this.schedulerService.getEventData.subscribe(
      res => {
        if (res) {

          this.log = res.data;
          this.pageLength = res.pageDetail.totalElements;
          this.dataSource = new MatTableDataSource(this.log);
          this.log.forEach(e => {
            if(e.Type=="ERROR"){
              if(!this.alertForError.includes(e.Id)){
                this.alertForError.push(e.Id);
                audio.play();
              }
            }
          });
        }
      }
    )

  }


  getLogData() {
    let pagination = `&from=&to=&pageNumber=${this.page}&pageSize=${this.size}`;
    this.apiService.get('api/application-logs?types=EVENT,ERROR' + pagination).subscribe(
      res => {

        this.log = res.data;
        this.pageLength = res.pageDetail.totalElements;
        this.dataSource = new MatTableDataSource(this.log);
      },
      err => {

      }
    )
  }

  onPaginateChange(event) {
    this.size = event.pageSize;
    this.page = event.pageIndex;
    this.getLogData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
